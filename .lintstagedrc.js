module.exports = {
  "*.{ts,tsx,js,jsx}": (filenames) => {
    const commands = [];

    // Grouper les fichiers par package
    const filesByPackage = {};
    filenames.forEach((file) => {
      if (file.startsWith("apps/api-gateway/")) {
        if (!filesByPackage["api-gateway"]) filesByPackage["api-gateway"] = [];
        filesByPackage["api-gateway"].push(
          file.replace("apps/api-gateway/", ""),
        );
      } else if (file.startsWith("apps/auth-service/")) {
        if (!filesByPackage["auth-service"])
          filesByPackage["auth-service"] = [];
        filesByPackage["auth-service"].push(
          file.replace("apps/auth-service/", ""),
        );
      }
    });

    // Ajouter prettier pour tous les fichiers
    commands.push(`prettier --write ${filenames.join(" ")}`);

    // Ajouter eslint pour chaque package
    Object.entries(filesByPackage).forEach(([pkg, files]) => {
      if (files.length > 0) {
        commands.push(
          `cd apps/${pkg} && pnpm exec eslint --fix ${files.join(" ")}`,
        );
      }
    });

    return commands;
  },
  "*.{json,md,yml,yaml}": "prettier --write",
};
