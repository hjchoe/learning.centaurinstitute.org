import catalog from "../../api/src/seeds/Video.json";

const normalize = (value?: string | null) =>
  (value ?? "").trim().toLowerCase();

const catalogHttp = {
  async get(path: string) {
    const url = new URL(path, "https://preview-api.invalid");
    const { pathname, searchParams } = url;

    if (url.origin !== "https://preview-api.invalid" || pathname !== "/videos") {
      throw new Error("Only catalog reads are available in this preview.");
    }

    const event = searchParams.get("event");
    const tag = normalize(searchParams.get("tags"));
    const category = normalize(searchParams.get("category"));
    const speaker = normalize(searchParams.get("speaker"));
    const rawLimit = searchParams.get("limit");

    const videos = catalog.seed.filter(
      (video) =>
        (!event || video.event === event) &&
        (!tag || video.tags?.some((value) => normalize(value) === tag)) &&
        (!category || normalize(video.category) === category) &&
        (!speaker || video.authors?.some((value) => normalize(value) === speaker)),
    );

    return {
      data: rawLimit === null ? videos : videos.slice(0, Number(rawLimit)),
    };
  },
};

export default catalogHttp;
