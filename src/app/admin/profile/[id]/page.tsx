interface PageProps {
  params: {
    id: string; // ชื่อต้องตรงกับ [id]
  };
}

const Page = ({ params }: PageProps) => {
  const { id } = params;

  return (
    <div>
      Profile ID: {id}
    </div>
  );
};

export default Page;
