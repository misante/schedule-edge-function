// import DocumentForm from "./_components/DocumentForm";
import DocumentsPage from "./_components/DocumentsPage";
import Header from "./_components/Header";

export default function Home() {
  return (
    <div className=" mt-20 text-center text-2xl text-green-500 font-bold min-h-screen capitalize">
      <Header />
      <DocumentsPage />
    </div>
  );
}
