const fs = require('fs');
const path = require('path');

const routes = [
  '/admin',
  '/admin/overview',
  '/admin/abstracts',
  '/admin/abstracts/pending',
  '/admin/abstracts/approved',
  '/admin/abstracts/rejected',
  '/admin/abstracts/categories',
  '/admin/abstracts/[id]',
  '/admin/speakers',
  '/admin/speakers/create',
  '/admin/speakers/[id]',
  '/admin/speakers/categories',
  '/admin/speakers/sessions',
  '/admin/registrations',
  '/admin/registrations/pending',
  '/admin/registrations/approved',
  '/admin/registrations/rejected',
  '/admin/registrations/tickets',
  '/admin/registrations/export',
  '/admin/failed-payments',
  '/admin/failed-payments/retry',
  '/admin/failed-payments/logs',
  '/admin/pricing',
  '/admin/pricing/visitor-passes',
  '/admin/pricing/booth-packages',
  '/admin/pricing/sponsorships',
  '/admin/pricing/coupons',
  '/admin/brochures',
  '/admin/brochures/upload',
  '/admin/brochures/analytics',
  '/admin/inbox',
  '/admin/inbox/contact',
  '/admin/inbox/booths',
  '/admin/inbox/sponsorships',
  '/admin/inbox/support',
  '/admin/send-emails',
  '/admin/send-emails/create',
  '/admin/send-emails/templates',
  '/admin/send-emails/scheduled',
  '/admin/send-emails/analytics',
  '/admin/sponsors',
  '/admin/sponsors/create',
  '/admin/sponsors/tiers',
  '/admin/sponsors/media-partners',
  '/admin/content',
  '/admin/content/homepage',
  '/admin/content/hero',
  '/admin/content/about',
  '/admin/content/footer',
  '/admin/content/navbar',
  '/admin/content/pages',
  '/admin/content/seo',
  '/admin/topics',
  '/admin/topics/create',
  '/admin/topics/categories',
  '/admin/venue',
  '/admin/venue/hotels',
  '/admin/venue/travel',
  '/admin/venue/maps',
  '/admin/schedule',
  '/admin/schedule/create',
  '/admin/schedule/timeline',
  '/admin/schedule/workshops',
  '/admin/schedule/networking',
  '/admin/settings',
  '/admin/settings/general',
  '/admin/settings/branding',
  '/admin/settings/payments',
  '/admin/settings/seo',
  '/admin/settings/security',
  '/admin/settings/api-keys',
  '/admin/organizers',
  '/admin/organizers/create',
  '/admin/organizers/roles',
  '/admin/users',
  '/admin/users/[id]',
  '/admin/users/roles',
  '/admin/users/blocked'
];

routes.forEach(route => {
  const dirPath = path.join(__dirname, 'app', route);
  fs.mkdirSync(dirPath, { recursive: true });
  
  const segments = route.split('/').filter(Boolean);
  const title = segments[segments.length - 1] || 'Dashboard';
  const capitalizedTitle = title.charAt(0).toUpperCase() + title.slice(1);
  
  // Create a placeholder page.tsx
  const content = `export default function Page() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 text-white">${capitalizedTitle.replace(/-/g, ' ')}</h1>
      <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 shadow-2xl">
        <p className="text-slate-400">Content for ${route} will go here.</p>
      </div>
    </div>
  );
}
`;
  
  fs.writeFileSync(path.join(dirPath, 'page.tsx'), content);
});

console.log('Successfully scaffolded all routes!');
