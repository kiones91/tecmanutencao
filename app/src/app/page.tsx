import { redirect } from 'next/navigation';

export default function RootPage() {
  // O app é estritamente o Painel ERP / Área do Sócio
  // Redireciona imediatamente a raiz para a tela de login
  redirect('/login');
}
