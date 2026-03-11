type NewsForm = {
  id: number;
  title: string;
  content: string;
  tags: string[];
  category: string;
  imageUrl: string;
  privateYn: boolean;
  pinnedYn: boolean;
  createdAt: string;
  collectedVideos: { assetId: string; playbackId: string }[];
};
