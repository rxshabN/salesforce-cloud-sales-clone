# Salesforce Clone - AI Coding Assistant Instructions

## Project Overview

This is a Salesforce Sales Cloud clone built with Next.js 15, TypeScript, Prisma ORM, and PostgreSQL (Supabase). The application follows Salesforce's object model and API structure with a custom UI.

## Architecture

### Data Model (src/prisma/schema.prisma)

Four core entities mirror Salesforce's CRM structure:

- **Leads**: Prospects not yet qualified (status-based workflow)
- **Accounts**: Companies/organizations (can be hierarchical via `parent_account_id`)
- **Contacts**: People linked to Accounts (can report to other Contacts via `reports_to_contact_id`)
- **Opportunities**: Sales deals linked to Accounts

**Critical workflow**: Leads can be "converted" via `/api/v1/actions/convert-lead`, which atomically creates an Account, Contact, and Opportunity in a single Prisma transaction, then marks the Lead as "Converted".

### API Structure (src/app/api/v1/)

Follows Salesforce REST API conventions:

- **Base path**: `/api/v1/sobjects/{objectName}` (NOT `/api/v1/{objectName}`)
- **Standard CRUD**: POST (create), GET (by ID), PATCH (update), DELETE
- **Actions**: Special operations in `/api/v1/actions/` (e.g., convert-lead)
- **Swagger docs**: Auto-generated at `/api/docs` route, schemas in `src/lib/swagger.ts`

All route handlers use `@swagger` JSDoc comments for automatic API documentation.

### Frontend Architecture (src/components/)

- **Single-page dashboard**: Main UI in `salesforce-dashboard.tsx` (~1700 lines) manages all lead/contact/opportunity workflows
- **Modal-driven CRUD**: Separate modal components in `src/components/modals/` for create, edit, delete, and convert operations
- **Global layout**: Fixed header (top), sidebar (left), main content area, and floating to-do list via `src/app/layout.tsx`
- **Client-side state**: All data fetching/mutations happen in client components (marked with `"use client"`)

### UI Components (src/components/ui/)

Uses **shadcn/ui** (New York style) with Radix UI primitives:

- Components aliased via `@/components/ui/*` (see `components.json`)
- Tailwind CSS with custom `cn()` utility from `@/lib/utils.ts`
- Toast notifications via custom `toast-provider.tsx`

## Key Workflows

### Development

```bash
npm run dev           # Turbopack dev server (port 3000)
npm run build         # Runs prisma generate first, then builds
npx prisma migrate dev # Create/apply schema migrations
npx prisma studio     # GUI for database inspection
```

### Database Connection

- **Pooled**: `DATABASE_URL` uses Supabase connection pooling (port 6543 with pgbouncer)
- **Direct**: `DIRECT_URL` for migrations (port 5432)
- **Singleton pattern**: Always import Prisma client from `@/lib/prisma.ts` (prevents hot reload issues)
- **Keep-alive**: GitHub Action (`keep-db-alive.yaml`) pings DB daily to prevent Supabase free-tier hibernation

## Project-Specific Conventions

### File Organization

- **Route groups**: Pages organized by object type (`src/app/accounts/`, `src/app/lead/`, `src/app/contacts/`, `src/app/sales/`)
- **Dynamic routes**: Use `[id]/page.tsx` pattern (e.g., `src/app/lead/[id]/page.tsx`)
- **API routes**: Must export named HTTP method functions (GET, POST, PATCH, DELETE) in route.ts files

### TypeScript Patterns

- **Path aliases**: Use `@/` for imports from `src/` directory
- **No validation layer**: Direct Prisma operations without Zod/validation in API routes (validation happens client-side)
- **Type inference**: Rely on Prisma-generated types rather than manual interfaces

### Styling

- **Tailwind classes**: Prefer inline Tailwind over CSS modules
- **Color system**: Uses Salesforce-inspired palette (e.g., `bg-[#f3f2f2]`, `text-[#181818]`, `border-[#dddbda]`)
- **Layout**: Fixed positioning with explicit top/left/right/bottom values (see layout.tsx: `top-[92px] left-[68px]`)

### Component Patterns

- **Form state**: Local useState for each form field (no react-hook-form in modals despite being installed)
- **Error handling**: Track validation errors in separate state objects (e.g., `leadErrors`, `contactErrors`)
- **Modal lifecycle**: Modals receive `open` and `onOpenChange` props for controlled state

## Integration Points

### External Dependencies

- **Supabase**: PostgreSQL hosting (free tier requires keep-alive)
- **Vercel Analytics**: Imported in package.json but not visibly configured
- **Swagger UI**: Available at `/docs` route for interactive API testing

### Data Flow

1. User interaction in dashboard component
2. Modal opens with form
3. Client-side validation sets error states
4. On submit, direct fetch/axios to `/api/v1/sobjects/*`
5. API route uses Prisma singleton to perform DB operation
6. Response triggers toast notification
7. Dashboard re-renders (no global state management)

## Common Pitfalls

1. **Prisma location**: Schema is in `src/prisma/` (not root `prisma/`). Update `package.json` prisma.schema path if moving.
2. **API path**: Always use `/api/v1/sobjects/` prefix - `/api/leads` won't work
3. **Transaction scope**: Lead conversion MUST use `prisma.$transaction` to ensure atomicity
4. **Modal state**: Forms don't auto-reset on close - manually clear state in `onOpenChange`
5. **Turbopack**: Required for dev/build - removing `--turbopack` flag will break build

## When Adding Features

### New sobject type

1. Add Prisma model to schema.prisma with indexes
2. Run `npx prisma migrate dev --name add_<object>`
3. Create API routes: `src/app/api/v1/sobjects/<object>/route.ts` and `[id]/route.ts`
4. Add Swagger schemas to `src/lib/swagger.ts`
5. Create modals: `create-<object>-modal.tsx`, `edit-<object>-modal.tsx`, `delete-<object>-modal.tsx`
6. Add UI section to main dashboard or create dedicated page in `src/app/<object>/`

### New action endpoint

1. Create in `src/app/api/v1/actions/<action-name>/route.ts`
2. Use `prisma.$transaction` for multi-table operations
3. Add comprehensive Swagger documentation
4. Create corresponding modal if UI-driven

### New page route

1. Create directory in `src/app/` with `page.tsx`
2. Import/export component (default export required)
3. Add navigation in sidebar.tsx if needed
4. All pages automatically wrapped by root layout (header/sidebar/footer)
