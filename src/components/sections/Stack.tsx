import styles from "./Stack.module.css";

export function Stack() {
    return (
        <section className={`${styles.container} hero-mesh-gradient`}>
            <h1 className={styles.title}>Stack</h1>
            <section className={styles.stackRow}>
                <p>TypeScript</p>
                <p>NodeJS</p>
                <p>NestJS</p>
                <p>PostgreSQL</p>
                <p>MongoDB</p>
                <p>React</p>
                <p>React Native</p>
                <p>CSS</p>
                <p>Git</p>
            </section>
            <h2 className={styles.secondaryTitle}>Tambien he trabajado en algunos proyectos puntuales con:</h2>
            <section className={styles.secondaryStack}>
                <p>Electrón</p>
                <p>Google APIs</p>
                <p>Express</p>
                <p>Tailwind</p>
            </section>
        </section>
    );
}