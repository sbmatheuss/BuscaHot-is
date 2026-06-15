export default function Footer() {
  return (
    <footer className="mt-12 border-t bg-gray-50 py-6 text-center text-sm text-gray-500">
      <div className="container-page">
        <p>© {new Date().getFullYear()} BuscaHotéis — Encontre e reserve hotéis econômicos.</p>
      </div>
    </footer>
  );
}
