import { useRouter } from "next/navigation";

const Logo = () => {
  const router = useRouter();

  return (
    <div
      className="text-2xl font-bold text-gray-800 cursor-pointer"
      onClick={() => router.push("/")}
    >
      News<span className="text-blue-600">Finder</span>
    </div>
  );
};

export default Logo;
