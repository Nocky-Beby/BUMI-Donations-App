import Button from "../../components/ui/Button";

export default function AdminSettings() {
  return (
    <div className="card p-8">
      <h2 className="text-3xl font-bold text-slate-900">Paramètres</h2>
      <p className="mt-3 text-slate-600">
        Cette section prépare la configuration des rôles, des notifications, des canaux de paiement
        et des préférences globales de la plateforme.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <div>
          <label className="label">Nom de la plateforme</label>
          <input className="input" defaultValue="BUMI — Gestion des dons" />
        </div>
        <div>
          <label className="label">Email de contact</label>
          <input className="input" defaultValue="contact@bumi.org" />
        </div>
        <div>
          <label className="label">Activation des notifications</label>
          <select className="input" defaultValue="Oui">
            <option>Oui</option>
            <option>Non</option>
          </select>
        </div>
        <div>
          <label className="label">Paiements en ligne</label>
          <select className="input" defaultValue="Prévu">
            <option>Prévu</option>
            <option>Actif</option>
            <option>Désactivé</option>
          </select>
        </div>
      </div>

      <div className="mt-8">
        <Button type="button">Enregistrer les paramètres</Button>
      </div>
    </div>
  );
}
