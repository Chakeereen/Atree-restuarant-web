import AdminProfile from "@/components/common/admin/Profile/Profile";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  return (
    <div>
      <AdminProfile adminID={id} />
    </div>
  );
};

export default Page;
