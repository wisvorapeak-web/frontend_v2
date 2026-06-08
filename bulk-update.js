const fs = require('fs');
const path = require('path');

const routesToSkip = [
  '/admin',
  '/admin/overview',
  '/admin/abstracts',
  '/admin/speakers',
  '/admin/registrations',
  '/admin/settings'
];

function updateDirectory(dirPath, currentRoute) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const routePath = currentRoute === '/admin' && entry.name === 'page.tsx' 
      ? '/admin' 
      : (entry.isDirectory() ? currentRoute + '/' + entry.name : currentRoute);

    if (entry.isDirectory()) {
      updateDirectory(fullPath, routePath);
    } else if (entry.name === 'page.tsx' && !routesToSkip.includes(routePath)) {
      
      const segments = routePath.split('/').filter(Boolean);
      const title = segments[segments.length - 1] || 'Dashboard';
      const capitalizedTitle = title.charAt(0).toUpperCase() + title.slice(1);
      const formattedTitle = capitalizedTitle.replace(/-/g, ' ').replace(/\\[id\\]/g, 'Details');

      const content = `"use client";\n\n` +
      `import { PageHeader } from "@/components/admin/PageHeader";\n\n` +
      `export default function Page() {\n` +
      `  return (\n` +
      `    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">\n` +
      `      <PageHeader \n` +
      `        title="${formattedTitle}" \n` +
      `        description="Manage ${formattedTitle.toLowerCase()} settings and configurations."\n` +
      `        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: '${formattedTitle}', href: '${routePath}' }]}\n` +
      `      />\n` +
      `      <div className="rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-8 shadow-2xl flex items-center justify-center min-h-[400px]">\n` +
      `        <div className="text-center">\n` +
      `          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">\n` +
      `            <span className="text-2xl opacity-50">🚧</span>\n` +
      `          </div>\n` +
      `          <h3 className="text-lg font-medium text-white mb-2">Module Under Construction</h3>\n` +
      `          <p className="text-slate-400 max-w-md mx-auto">\n` +
      `            The ${formattedTitle} module has been scaffolded and is awaiting backend integration and specific business logic implementation.\n` +
      `          </p>\n` +
      `        </div>\n` +
      `      </div>\n` +
      `    </div>\n` +
      `  );\n` +
      `}\n`;
      fs.writeFileSync(fullPath, content);
    }
  }
}

updateDirectory(path.join(__dirname, 'app', 'admin'), '/admin');
console.log('Bulk update completed successfully!');
