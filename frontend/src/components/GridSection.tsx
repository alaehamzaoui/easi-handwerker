// components/GridSection.tsx
import styles from '@/styles/GridSection.module.css';

export default function GridSection() {
  const items = [
    { title: "Project A", description: "Description of project A." },
    { title: "Project B", description: "Description of project B." },
    { title: "Project C", description: "Description of project C." },
    { title: "Project D", description: "Description of project D." },
  ];

  return (
    <div className={styles.gridContainer}>
      {items.map((item, index) => (
        <div key={index} className={styles.gridItem}>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
}
