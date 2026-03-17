import React from "react";
import { RectangleSkeleton } from "@docspace/ui-kit/components/rectangle";

import styles from "./PaymentMethodLoader.module.scss";

const PaymentMethodLoader: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.sectionHeader}>
        <RectangleSkeleton width="80px" height="22px" borderRadius="3px" />
        <RectangleSkeleton width="16px" height="16px" borderRadius="50%" />
      </div>

      <RectangleSkeleton
        width="400px"
        height="16px"
        borderRadius="3px"
        className={styles.description}
      />

      <RectangleSkeleton
        width="100%"
        height="72px"
        borderRadius="6px"
        className={styles.payerCard}
      />

      <div className={styles.sectionHeader}>
        <RectangleSkeleton width="150px" height="22px" borderRadius="3px" />
      </div>

      <RectangleSkeleton
        width="400px"
        height="16px"
        borderRadius="3px"
        className={styles.description}
      />

      <RectangleSkeleton
        width="100%"
        height="48px"
        borderRadius="6px"
        className={styles.cardRow}
      />

      <RectangleSkeleton width="120px" height="32px" borderRadius="3px" />
    </div>
  );
};

export default PaymentMethodLoader;
