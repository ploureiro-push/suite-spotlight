# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/720ddf85-da1b-4a33-a7c2-67e9e05272c8

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/720ddf85-da1b-4a33-a7c2-67e9e05272c8) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

**Deploy via Lovable**

Simply open [Lovable](https://lovable.dev/projects/720ddf85-da1b-4a33-a7c2-67e9e05272c8) and click on Share -> Publish.

**Deploy to GitLab Pages**

To deploy this project to GitLab Pages, follow these steps:

1. Create a `.gitlab-ci.yml` file in the root of your project with the following content:

```yaml
# GitLab CI/CD pipeline for deploying to GitLab Pages
image: node:lts

cache:
  paths:
    - node_modules/

pages:
  stage: deploy
  script:
    - npm ci
    - npm run build
    - cp -a dist/. public/
  artifacts:
    paths:
      - public
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
```

2. Push your code to a GitLab repository
3. Go to your GitLab project's Settings > Pages
4. The site will be automatically built and deployed when you push to the main branch
5. Your site will be available at `https://yourusername.gitlab.io/yourprojectname`

**Note**: Make sure your GitLab project has Pages enabled and the pipeline runs successfully.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
