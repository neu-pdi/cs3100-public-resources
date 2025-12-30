# NEU CS 3100 Public Resources

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

### Installation

```
$ yarn
```

### Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

Using SSH:

```
$ USE_SSH=true yarn deploy
```

Not using SSH:

```
$ GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.

## Staff Management

### Editing Staff Data

Staff information is managed in `src/data/staff.ts`. To add, edit, or remove staff members, edit this file.

#### Staff Data Structure

Each staff member is an object with the following required fields:

```typescript
{
  name: string;           // Full name (e.g., "Dr. Jane Smith")
  pronouns: string;       // Pronouns (e.g., "he/him", "she/her", "they/them")
  role: StaffRole;        // One of: "instructor", "academic-coordinator", or "ta"
  campus: string;        // Campus location (e.g., "Boston", "Oakland", "Seattle")
  bio: string;           // Brief biography (no length limit, displayed in full)
  headshot: string;      // Image filename from static/img/staff/ (e.g., "jane-smith.jpg")
}
```

#### Important Notes

- **Role Types**: The `role` field must be exactly one of:
  - `"instructor"` - Course instructors
  - `"academic-coordinator"` - Academic coordinators
  - `"ta"` - Teaching assistants

- **Automatic Sorting**: Staff members are automatically grouped and displayed in this order:
  1. Instructors
  2. Academic Coordinators
  3. Teaching Assistants
  
  The order within each group follows the order in the `staffMembers` array.

- **Image Filenames**: The `headshot` field should reference only the filename (not the full path). Images must be placed in `static/img/staff/` directory. See [Image Requirements](#image-requirements) below.

- **Missing Images**: If an image file doesn't exist, the component will automatically fall back to a silhouette placeholder (`/img/staff-placeholder.svg`).

- **TypeScript**: The file uses TypeScript, so you'll get helpful autocomplete and type checking when editing. Make sure all required fields are present.

#### Example

```typescript
export const staffMembers: StaffMember[] = [
  // Instructors
  {
    name: "Dr. Jane Smith",
    pronouns: "she/her",
    role: "instructor",
    campus: "Boston",
    bio: "Associate Professor of Computer Science with research interests in software engineering and program design.",
    headshot: "jane-smith.jpg"
  },
  
  // Academic Coordinator
  {
    name: "Alex Martinez",
    pronouns: "they/them",
    role: "academic-coordinator",
    campus: "Boston",
    bio: "Academic coordinator supporting course logistics and student services.",
    headshot: "alex-martinez.jpg"
  },
  
  // Teaching Assistants
  {
    name: "Alice Johnson",
    pronouns: "she/her",
    role: "ta",
    campus: "Boston",
    bio: "Graduate student in Computer Science with interests in software engineering.",
    headshot: "alice-johnson.jpg"
  },
  // ... more staff members
];
```

### Staff Headshots

Place staff member headshot images in `static/img/staff/`.

#### Image Requirements

- **Format**: JPG or PNG (any size - will be automatically optimized)
- **Size**: Any size is fine - images are automatically resized and cropped to 300x300px at build time
- **Naming**: Use lowercase with hyphens (e.g., `jane-doe.jpg`)
- **Aspect Ratio**: Any aspect ratio is fine - images are center-cropped to square during optimization

#### Automatic Image Optimization

Images placed in this directory are **automatically processed at build time**:

- ✅ Resized and center-cropped to 300x300px (square)
- ✅ Optimized for web (JPEG quality: 85%, PNG compression: level 9)
- ✅ WebP versions generated for modern browsers (better compression)
- ✅ Original aspect ratio preserved through center cropping

Images will be automatically optimized and served from `/img/staff/` in the built site. The component automatically uses WebP when available, with fallback to the optimized JPEG/PNG.
