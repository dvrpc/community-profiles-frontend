import Button from "@/components/Buttons/Button";
import { useTestSql } from "@/lib/hooks";
import { Sql, SqlForm } from "@/types/types";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import ResultsTable from "./ResultsTable";

const emptyForm: SqlForm = {
  name: "",
  data_source: "",
  geo_level: "",
  body: "",
};

const DATA_SOURCES = [
  { value: "gis", label: "GIS" },
  { value: "ckan", label: "CKAN" },
];

const GEO_LEVELS = [
  { value: "region", label: "Region" },
  { value: "county", label: "County" },
  { value: "municipality", label: "Municipality" },
];

interface Props {
  initialData: Sql | null;
  onCancel: () => void;
  onSave: (variable: SqlForm) => void;
}

export default function SqlModal(props: Props) {
  const { initialData, onCancel, onSave } = props;
  const [detailed, setDetailed] = useState(false);
  const [form, setForm] = useState<SqlForm>(initialData || emptyForm);
  const [error, setError] = useState<string>("");
  const {
    mutate: testMutation,
    data: testData,
    status: testStatus,
    error: testError,
  } = useTestSql(detailed);

  useEffect(() => {
    setForm(initialData ? initialData : emptyForm);
    setError("");
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (form.data_source && form.geo_level && form.body) {
      testMutation(form);
    }
  }, [form, detailed]);

  const handleSaveClick = () => {
    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!form.data_source) {
      setError("Data source is required.");
      return;
    }

    if (!form.geo_level) {
      setError("Geo level is required.");
      return;
    }

    if (!form.body.trim()) {
      setError("SQL body is required.");
      return;
    }

    setError("");
    onSave(form);
  };

  function renderTestStatus() {
    if (!form.data_source || !form.geo_level || !form.body) return null;

    if (testStatus === "pending") {
      return (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Loader2 className="animate-spin" size={16} />
          Testing SQL...
        </div>
      );
    }

    if (testStatus === "error") {
      return (
        <div className="text-sm text-red-600">
          Error testing SQL:
          <div className="mt-2 p-2 bg-gray-100 rounded">
            <pre className="text-xs overflow-y-auto break-words w-full whitespace-pre-wrap">
              {testError instanceof Error ? testError.message : "Unknown error"}
            </pre>
          </div>
        </div>
      );
    }

    if (testStatus === "success") {
      const rows = Array.isArray(testData)
        ? (testData as Record<string, unknown>[])
        : null;
      return (
        <>
          <div className="text-sm text-green-600">SQL test successful!</div>
          {rows ? (
            <ResultsTable data={rows} />
          ) : testData ? (
            <div className="mt-2 p-2 bg-gray-100 rounded">
              <pre className="text-xs overflow-auto max-h-40">
                {JSON.stringify(testData, null, 2)}
              </pre>
            </div>
          ) : null}
        </>
      );
    }

    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-6 overflow-auto h-9/10">
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? "Edit SQL Query" : "New SQL Query"}
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
                Data Source <span className="text-red-600">*</span>
              </label>
              <select
                name="data_source"
                value={form.data_source}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-2"
              >
                <option value="">Select a data source</option>
                {DATA_SOURCES.map((source) => (
                  <option key={source.value} value={source.value}>
                    {source.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">
                Geo Level <span className="text-red-600">*</span>
              </label>
              <select
                name="geo_level"
                value={form.geo_level}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-2"
              >
                <option value="">Select a geo level</option>
                {GEO_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">
              SQL Body <span className="text-red-600">*</span>
            </label>
            <textarea
              name="body"
              value={form.body}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2 h-100"
            />
          </div>
        </div>
        <div>
          <div className="flex gap-2 mt-2">
            <input
              name="aggregateable"
              type="checkbox"
              checked={detailed}
              onChange={(e) => setDetailed(e.target.checked)}
              required
              className=""
            />
            <label className="font-medium">
              Enable Detailed Testing (longer queries){" "}
              <span className="text-red-600">*</span>
            </label>
          </div>
          <div className="mt-4">{renderTestStatus()}</div>
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
