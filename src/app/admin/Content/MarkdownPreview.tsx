
interface Props {
  content: string;
}
export default function MarkdownPreview(props: Props) {
  const { content } = props;

  return (
    <div
      className="flex flex-col gap-4 px-4 py-6"
      dangerouslySetInnerHTML={{ __html: content }}
    ></div>
  );
}
