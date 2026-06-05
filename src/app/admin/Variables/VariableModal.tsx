import Button from "@/components/Buttons/Button";
import { useACSMetadata } from "@/lib/hooks";
import { categoryTitleMap, CATEGORIES } from "@/consts";
import { Variable, VariableForm } from "@/types/types";
import { useEffect, useState } from "react";

interface Props {
  initialData: Variable | null;
  onCancel: () => void;
  onSave: (variable: VariableForm) => void;
}

const emptyForm: VariableForm = {
  name: "",
  data_source: "acs",
  acs_variable: "",
  data_year: undefined,
  description: "",
  concept: "",
  aggregateable: true,
};

export default function VariableModal(props: Props) {
  const { initialData, onCancel, onSave } = props;
  const [form, setForm] = useState<VariableForm>(initialData || emptyForm);
  const [lookupVariable, setLookupVariable] = useState(
    initialData?.acs_variable ?? form.acs_variable ?? "",
  );

  const [error, setError] = useState<string>("");

  useEffect(() => {
    setForm(initialData ? initialData : emptyForm);
    setLookupVariable(initialData?.acs_variable ?? "");
  }, [initialData]);

  const {
    data: acsMetadata,
    isLoading: fetchingACS,
    isError: acsError,
  } = useACSMetadata(lookupVariable, form.data_year);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const target = e.target as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement;
    const { name, value } = target;
    const newValue =
      name === "data_year"
        ? value
          ? parseInt(value)
          : undefined
        : name === "aggregateable" && target instanceof HTMLInputElement
          ? target.checked
          : value;

    console.log("Updating form field", name, "to value", newValue);
    setForm({
      ...form,
      [name]: newValue,
      ...(name === "acs_variable" || name === "data_year"
        ? { concept: "", description: "" }
        : {}),
      ...(name === "aggregateable" && !newValue
        ? { geo_level: ["municipality", "county"] }
        : {}),
    });

    if (name === "acs_variable") {
      setLookupVariable(value);
    }
  };

  const handleSaveClick = () => {
    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!form.acs_variable) {
      setError("Acs variable is required");
      return;
    }
    if (!form.data_year) {
      setError("Data year is required");
      return;
    }

    if (form.data_source !== "acs") {
      setError("Only ACS variables can be managed here.");
      return;
    }

    if (!form.concept) {
      setError(
        "Invalid year and acs variable combination. Concept and description should auto populate",
      );
      return;
    }

    setError("");
    onSave(form);
  };

  useEffect(() => {
    if (acsMetadata) {
      setForm((prev) => ({
        ...prev,
        concept: acsMetadata.concept,
        description: acsMetadata.description,
      }));
    }
  }, [acsMetadata]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-6 overflow-auto h-9/10">
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? "Edit ACS Variable" : "New ACS Variable"}
        </h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-1">
              Name <span className="text-red-600">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">
                ACS Variable <span className="text-red-600">*</span>
              </label>
              <input
                name="acs_variable"
                value={form.acs_variable ?? ""}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              />
              {form.acs_variable &&
                form.data_year &&
                !fetchingACS &&
                acsError && (
                  <p className="text-red-600 text-sm mt-1">
                    Invalid ACS variable for the selected year.
                  </p>
                )}
            </div>
            <div>
              <label className="block font-medium mb-1">
                Data Year <span className="text-red-600">*</span>
              </label>
              <input
                name="data_year"
                required
                type="number"
                value={form.data_year ?? ""}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              />
            </div>
          </div>
          <div>
            <div className="flex gap-2">
              <input
                name="aggregateable"
                type="checkbox"
                checked={form.aggregateable}
                onChange={handleChange}
                required
                className=""
              />
              <label className="font-medium">
                Aggregateable <span className="text-red-600">*</span>
              </label>
            </div>
            <span className="text-dvrpc-gray-3 text-sm">
              Median, mean, per capita, and percent fields are not
              aggregateable. These fields require special treatment for
              calculating regional values
            </span>
          </div>
          <div>
            <label className="block font-medium mb-1">
              ACS Concept <span className="text-red-600">*</span>
            </label>
            <input
              name="concept"
              required
              disabled
              value={form.concept ?? ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2  bg-dvrpc-gray-7"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">
              Description <span className="text-red-600">*</span>
            </label>
            <textarea
              name="description"
              value={form.description ?? ""}
              required
              disabled
              onChange={handleChange}
              className="w-full border rounded-lg p-2 h-28 bg-dvrpc-gray-7"
            />
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <Button handleClick={onCancel} type="secondary">
            Cancel
          </Button>
          <Button handleClick={handleSaveClick} type="primary">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
