import styles from "./Stack.module.css";

export function Stack() {
    return (
        <section className={styles.container}>
            <h1>Stack</h1>
            <section className={styles.stackRow}>
                <p>TypeScript</p>
                <p>NodeJS</p>
                <p>NestJS</p>
                <p>PostgreSQL</p>
                <p>MongoDB</p>
                <p>Prisma</p>
                <p>TailwindCSS</p>
                <p>Git</p>
            </section>
        </section>
    );
}