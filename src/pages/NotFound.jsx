import Button from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="container-app flex min-h-[70vh] flex-col items-center justify-center text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-green">404</p>
      <h1 className="mt-4 text-4xl font-bold text-slate-900">Page introuvable</h1>
      <p className="mt-4 max-w-xl text-slate-600">
        La page demandée n’existe pas ou a été déplacée. Reviens vers l’accueil ou connecte-toi à ton espace.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Button to="/">Retour à l’accueil</Button>
        <Button to="/connexion" variant="secondary">Se connecter</Button>
      </div>
    </div>
  );
}
