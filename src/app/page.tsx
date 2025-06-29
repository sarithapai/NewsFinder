import HeaderComponent from "@/components/features/HeaderComponent";
import TopStoriesComponent from "@/components/features/TopStoriesComponent";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 ">
      <HeaderComponent />
      <TopStoriesComponent />
    </div>
  );
}
