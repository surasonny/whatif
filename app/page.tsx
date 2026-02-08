import StoryCard from "@/components/StoryCard";

const TEST_SCENES = [
  "눈을 뜨니 2010년 5월이다. 달력을 확인했다.",
  "내 주머니엔 딱 30만 원이 있다. 지금 비트코인은 개당 100원도 안 한다.",
  "떨리는 손으로 PC방 컴퓨터를 켰다. 거래소 사이트에 접속했다.",
  "그런데... 비밀번호가 기억나지 않는다. 식은땀이 흐른다.",
];

export default function Home() {
  return (
    <div className="h-screen w-full bg-[#000000]">
      <StoryCard scenes={TEST_SCENES} />
    </div>
  );
}
