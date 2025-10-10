import Link from "next/link";

interface Props {
    parentCounty?: string;
}
export default function BackLink(props: Props) {
    const { parentCounty } = props;

    if (parentCounty) {
        return (
            <Link href={`/${parentCounty.toLowerCase()}`}>
                &larr; Return to {parentCounty} County
            </Link>
        );
    }

    return <Link href="/">&larr; Return to Home</Link>
}