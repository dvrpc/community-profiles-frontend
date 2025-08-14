interface Props {
  title: string;
}

export default function HeroContent(props: Props) {
  const { title } = props;

  return (
    <div className="w-1/3 z-10 p-16">
      <h1 className="text-5xl text-dvrpc-blue-1 font-bold">{title}</h1>
    </div>
  );
}
