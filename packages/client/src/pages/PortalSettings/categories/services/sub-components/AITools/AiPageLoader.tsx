import React from "react";
import { RectangleSkeleton } from "@docspace/ui-kit/components/rectangle";

import styles from "./AiPageLoader.module.scss";

const AiPageLoader: React.FC = () => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.toggleSection}>
        <div className={styles.toggleRow}>
          <RectangleSkeleton width="28px" height="16px" borderRadius="16px" />
          <RectangleSkeleton width="200px" height="20px" borderRadius="3px" />
        </div>
        <div className={styles.toggleDescription}>
          <RectangleSkeleton width="100%" height="16px" borderRadius="3px" />
          <RectangleSkeleton width="80%" height="16px" borderRadius="3px" />
        </div>
      </div>

      <div className={styles.balanceCard}>
        <RectangleSkeleton width="100px" height="16px" borderRadius="3px" />
        <RectangleSkeleton width="80px" height="28px" borderRadius="3px" />
        <RectangleSkeleton width="100%" height="32px" borderRadius="3px" />
      </div>

      <div className={styles.lastTopUpRow}>
        <RectangleSkeleton width="280px" height="16px" borderRadius="3px" />
      </div>

      <div className={styles.tabsSection}>
        <div className={styles.tabsHeader}>
          <RectangleSkeleton width="60px" height="20px" borderRadius="3px" />
          <RectangleSkeleton width="110px" height="20px" borderRadius="3px" />
        </div>

        <div className={styles.tableHeader}>
          <RectangleSkeleton width="100%" height="32px" borderRadius="3px" />
          <RectangleSkeleton width="100%" height="32px" borderRadius="3px" />
          <RectangleSkeleton width="100%" height="32px" borderRadius="3px" />
        </div>

        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className={styles.tableRow}>
            <RectangleSkeleton width="100%" height="20px" borderRadius="3px" />
            <RectangleSkeleton width="100%" height="20px" borderRadius="3px" />
            <RectangleSkeleton width="100%" height="20px" borderRadius="3px" />
            <RectangleSkeleton width="100%" height="20px" borderRadius="3px" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AiPageLoader;
