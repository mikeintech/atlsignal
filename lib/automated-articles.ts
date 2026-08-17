import newsroomData from "@/data/newsroom.json";
type NewsroomCluster = (typeof newsroomData.clusters)[number];

export function automaticArticleSlug(cluster: NewsroomCluster) {
  return newsroomData.publishedDeskBriefs.find((item) => item.clusterId === cluster.id)?.slug;
}
