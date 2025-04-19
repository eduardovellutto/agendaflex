# AgendaFlex

AgendaFlex é uma plataforma de agendamento para profissionais liberais gerenciarem agendamentos, clientes e pagamentos em um só lugar.

## Tecnologias

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Firebase (Auth, Firestore)
- shadcn/ui

## Instalação

Clone o repositório:

\`\`\`bash
git clone https://github.com/seu-usuario/agendaflex.git
cd agendaflex
\`\`\`

Instale as dependências:

\`\`\`bash
npm install
\`\`\`

Configure as variáveis de ambiente:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Edite o arquivo `.env.local` com suas credenciais do Firebase:

\`\`\`env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
\`\`\`

## Desenvolvimento

Inicie o servidor de desenvolvimento:

\`\`\`bash
npm run dev
\`\`\`

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

## Build

Para criar uma versão de produção:

\`\`\`bash
npm run build
\`\`\`

Para iniciar a versão de produção:

\`\`\`bash
npm start
\`\`\`

## Estrutura do Projeto

- `/app` - Rotas e páginas da aplicação (App Router)
- `/components` - Componentes React reutilizáveis
- `/lib` - Utilitários, hooks, serviços e tipos
- `/public` - Arquivos estáticos

## Licença

MIT
