import { Text } from "@docspace/shared/components/text";
import { Link, LinkTarget } from "@docspace/shared/components/link";
import { InfoBar } from "@docspace/shared/components/info-bar";
import styles from "../Plugins.module.scss";
import { UploadDecsriptionProps } from "../Plugins.types";

const UploadDescription = ({
  pluginsSdkUrl,
  currentColorScheme,
  t,
}: UploadDecsriptionProps) => {
  return (
    <div className={styles.uploadDescription}>
      <Text className={styles.uploadDescriptionText}>
        {t("UploadDescription", { productName: t("Common:ProductName") })}
      </Text>
      {pluginsSdkUrl ? (
        <Link
          className={styles.linkLearnMore}
          color={currentColorScheme.main?.accent}
          isHovered
          target={LinkTarget.blank}
          href={pluginsSdkUrl}
          dataTestId="api_plugins_sdk_link"
        >
          {t("Common:LearnMore")}
        </Link>
      ) : null}
      <InfoBar
        className={styles.infoBar}
        title={t("PluginCacheWarningTitle")}
        description={t("PluginCacheWarningDescription")}
        dataTestId="plugin_cache_warning"
      />
    </div>
  );
};

export default UploadDescription;
