interface LogDetailsPageProps {
    params: {
        id: string;
    }
}

export default function LogDetailsPage({ params: { id } }: LogDetailsPageProps) {
    return <div>Log Details {id}</div>;
    // TODO
}
