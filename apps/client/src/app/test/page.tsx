import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const TestPage = async () => {
  const session = await getServerSession(authOptions);
  const token = session?.user?.token;

  console.log("session token", token);

  return <div className="">TestPage</div>;
};

export default TestPage;
