const assets = import.meta.globEager("./*", { as: "url" });

export default function (name: string) {
  return assets["./" + name].default;
}
