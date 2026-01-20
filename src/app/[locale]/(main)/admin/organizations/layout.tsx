import { Container } from "@mantine/core";

export default function OrganizationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section style={{ width: '100%' }}>
            {children}
        </section>
    );
}
