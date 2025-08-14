import Image from "next/image";

interface Props {
  name: string;
  imagePath: string;
  href: string;
}

export default function CategoryButton(props: Props) {
  const { name, imagePath, href } = props;

  return (
    <a href={href}>
      <Image src={imagePath} width={72} height={72} alt="" />
      <span>{name}</span>
    </a>
  );
}
