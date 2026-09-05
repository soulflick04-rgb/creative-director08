# Creative Flow

Build a polished, production-quality web prototype called "Creative Director".

IMPORTANT CONTEXT:

This is an independent product prototype exploring how an AI creative platform could help creative professionals go from a creative brief to a recommended generation workflow.

It is NOT an official HexCoded product and must not claim to be affiliated with HexCoded.

The product concept:

"Tell me what you're trying to create. I'll figure out how to make it."

The target users are:

- filmmakers

- video editors

- designers

- creative agencies

- social media/content teams

- AI creators

The core problem:

Modern AI creative platforms expose users to many image/video models. Users often know the creative outcome they want but don't know which model, generation method, references, or sequence of steps to use.

The prototype should solve this by converting a creative brief into:

1. A creative plan

2. A shot-by-shot workflow

3. Recommended image/video models

4. A clear explanation of why each model is recommended

5. Suggested prompts

6. Required references

7. An estimated credit/cost level

8. A visual workflow that can be edited

THIS IS A DEMO PROTOTYPE.

Do NOT build a real AI generation backend.

Do NOT require API keys.

Do NOT call external AI APIs.

Use realistic local/mock data and deterministic recommendation logic so the demo works immediately.

==================================================

BRAND / VISUAL DIRECTION

==================================================

Create a premium modern AI creative-product interface.

Visual direction should feel:

- minimal

- editorial

- premium

- creative

- highly polished

- spacious

- confident

- professional

Use a very light warm-white/off-white background.

Primary accent:

fresh emerald/green.

Typography:

Use a modern geometric sans-serif such as Inter, Geist, or a similar clean font.

Use:

- black/dark charcoal text

- subtle gray borders

- rounded cards

- subtle shadows

- green accent states

- generous whitespace

Do NOT make it look like a generic SaaS dashboard.

Do NOT use gradients everywhere.

Do NOT use excessive glassmorphism.

Do NOT add unnecessary illustrations.

Do NOT use stock photos.

The interface should feel like a serious creative tool.

Responsive:

- desktop-first

- fully responsive on tablet/mobile

- sidebar collapses on mobile

==================================================

APP STRUCTURE

==================================================

Create these main areas:

1. Home / Creative Brief

2. Workflow

3. Models

4. Projects

Use a left sidebar on desktop.

Sidebar:

Logo:

"CD"

Navigation:

Home

Workflows

Models

Projects

Bottom:

Settings

Top-right:

"Demo Workspace"

small green status dot

avatar circle

==================================================

PAGE 1 — HOME

==================================================

Hero section:

Small eyebrow:

"CREATIVE DIRECTOR"

Large headline:

"Turn a creative brief

into the right AI workflow."

Supporting text:

"Describe what you're trying to make. Creative Director breaks it into shots, recommends the right models, and gives you the prompts to build it."

Large central brief input card.

Label:

"What are you making?"

Textarea placeholder:

"Describe your creative project...

e.g. A 20-second cinematic Instagram ad for a luxury watch. I have three product photos and want a person wearing it, dramatic lighting, smooth camera movement and a premium ending."

Below textarea:

Reference upload area:

"Add references"

"Drop images here or browse"

Allow multiple local image previews.

Below that show optional controls:

Platform:

Instagram

YouTube

TikTok

Web

Format:

9:16

16:9

1:1

Duration:

15 sec

30 sec

60 sec

Quality:

Fast

Balanced

Best

Main CTA:

"Build my workflow →"

Secondary small text:

"No generation yet. Just planning."

==================================================

DEMO EXPERIENCE

==================================================

When the user clicks "Build my workflow", do NOT call an API.

Analyze the text using simple keyword-based local logic.

Create a convincing loading transition:

"Reading your brief..."

"Breaking the idea into shots..."

"Matching creative tasks to models..."

"Building your workflow..."

Then navigate to /workflow.

The demo should work even if the user enters arbitrary text.

If keywords include:

watch, product, shoe, phone, bottle, car, fashion, product

create product-focused workflow.

If keywords include:

person, actor, human, talking, presenter

create character-focused workflow.

If keywords include:

cinematic, film, scene, story

create cinematic workflow.

If keywords include:

social, instagram, tiktok, reel

prioritize vertical social output.

For unknown prompts, create a generic 4-step creative workflow.

==================================================

PAGE 2 — WORKFLOW

==================================================

This is the most important page.

Top header:

"Your creative workflow"

Subheading:

"Built from your brief. You can edit every step."

Right side:

"Regenerate plan"

"Save workflow"

Show a brief summary card:

PROJECT

Luxury Watch — Instagram Ad

GOAL

Premium 20-second cinematic product advertisement

FORMAT

9:16

ESTIMATED USAGE

Balanced

Then show a large horizontal/vertical workflow canvas.

Create connected workflow nodes.

Example:

BRIEF

↓

01 PRODUCT HERO

↓

02 LIFESTYLE SHOT

↓

03 CINEMATIC MOTION

↓

04 FINAL REVEAL

Each node should look premium and interactive.

Node contents:

NUMBER

SHOT NAME

Type:

IMAGE / VIDEO

Recommended model:

Seedream 5.0 Pro

Small reason:

"Best fit for multiple references and product consistency."

Prompt preview:

"Luxury black watch on dark marble..."

Tags:

Reference required

High detail

Button:

"View details"

Each node should have a three-dot menu.

Allow:

- duplicate

- edit

- delete

- move

A green "+ Add step" button should allow adding another node.

==================================================

WORKFLOW DETAIL PANEL

==================================================

When clicking a node, open a right-side detail drawer.

Header:

"01 — Product Hero"

Show:

OBJECTIVE

Establish the product with a premium hero shot.

RECOMMENDED MODEL

Seedream 5.0 Pro

Badge:

"Recommended"

WHY THIS MODEL?

"Strong fit when you need multiple references and consistent product composition."

ALTERNATIVES

GPT Image 2

"Best when exact prompt control and clean in-image text matter."

FLUX.2 Max

"Best when maximum detail and reference matching are the priority."

PROMPT

"Luxury black mechanical watch resting on dark polished marble, dramatic studio lighting, controlled reflections, premium editorial product photography, deep shadows, cinematic composition..."

Button:

"Copy prompt"

REFERENCES

Show:

3 references recommended

USAGE

"Balanced"

Estimated:

"~ medium"

Button:

"Use this model"

This button should produce a toast:

"Model selected for this workflow step."

==================================================

MODEL RECOMMENDATION LOGIC

==================================================

Create a local model database.

IMAGE MODELS:

GPT Image 2

Best for:

- exact prompt control

- clean in-image text

- typography

Tags:

Prompt control

Text

Nano Banana Pro

Best for:

- character consistency

- studio-grade imagery

Tags:

Character

Consistency

Seedream 5.0 Pro

Best for:

- multi-reference composition

- multilingual text

- complex reference-based compositions

Tags:

References

Composition

Nano Banana 2

Best for:

- fast high-fidelity images

Tags:

Fast

Quality

FLUX.2 Max

Best for:

- maximum detail

- reference matching

Tags:

Detail

Reference

FLUX.2 Pro

Best for:

- high-detail image rendering

Tags:

Detail

GPT Image 1 Mini

Best for:

- rapid concept batches

Tags:

Fast

Concepts

Seedream 4.5

Best for:

- high-volume generation

Tags:

Volume

4K

FLUX.2 Klein 4B

Best for:

- rapid exploration

Tags:

Fast

Exploration

Recraft 4.1

Best for:

- expressive art direction

- photoreal visual direction

Tags:

Art direction

Photoreal

VIDEO MODELS:

Seedance 2.5

Best for:

- cinematic shots

- longer cinematic sequences

Tags:

Cinematic

Gemini Veo 3.1

Best for:

- native audio

- synced video/audio

Tags:

Audio

Cinematic

MiniMax Hailuo

Best for:

- text

- keyframes

- reference-based video

Tags:

References

Motion

Seedance 2.0

Best for:

- reference-composed cinematic video

- sound

Tags:

References

Audio

Wan 2.7

Best for:

- reference-composed video

Tags:

References

Hunyuan

Best for:

- native audio

- lip sync

Tags:

Audio

Lip sync

Kling 3.0

Best for:

- strong reference control

- frames/elements

Tags:

Control

References

Grok Imagine 1.5

Best for:

- cinematic clips

- synchronized audio

Tags:

Audio

Cinematic

LTX-2.3 Fast

Best for:

- rapid drafts

Tags:

Fast

Draft

Hailuo 2.3

Best for:

- fast high-dynamic motion from one image

Tags:

Image to video

Motion

Veo 3.1 Fast

Best for:

- faster video generation

Tags:

Fast

Kling 3.0 Turbo

Best for:

- fast cinematic clips

- audio

Tags:

Fast

Audio

Seedance 2 Mini

Best for:

- lightweight motion drafts

Tags:

Fast

Draft

Veo 3.1 Lite

Best for:

- lighter and quicker video generation

Tags:

Fast

Light

IMPORTANT:

These are demo model descriptions based on publicly visible product/model descriptions observed during product research. Present them as prototype data, not official model documentation.

==================================================

MODEL SELECTION PAGE

==================================================

Create /models.

Header:

"Models"

Subheading:

"Choose by creative outcome, not just model name."

Top search field:

"Search models..."

Filters:

All

Image

Video

Fast

Reference

Character

Audio

High quality

Display model cards.

Each card:

Model name

Image/Video badge

Short description

Best for

Tags

Speed indicator

Quality indicator

Add a small label:

"Recommended for your workflow"

for models currently used in the generated workflow.

Clicking a model opens its detail drawer.

==================================================

CREDIT / USAGE INTELLIGENCE

==================================================

This is an important product feature.

Create a "Usage" panel in the workflow.

Show three options:

FAST

"Lower usage"

"Good for exploration"

BALANCED

"Recommended"

"Quality + efficiency"

BEST

"Higher usage"

"Maximum quality"

Do NOT pretend to know exact real credit prices for every model.

Instead use relative estimates:

LOW

MEDIUM

HIGH

Example:

Estimated workflow usage

████████░░

Medium

"Your plan should prioritize 2–3 high-quality generations and use faster models for exploration."

Add a small disclaimer:

"Usage estimates are illustrative for this prototype."

==================================================

PROMPT INTELLIGENCE

==================================================

Every workflow node should have a generated prompt.

Include:

- subject

- environment

- camera

- lighting

- composition

- motion if video

- aspect ratio

- creative direction

Have buttons:

Copy prompt

Improve prompt

Make cinematic

Make minimal

Make more realistic

These buttons should modify the displayed prompt locally.

Example:

"Make cinematic" adds cinematic language.

"Make minimal" removes unnecessary adjectives.

"More realistic" adds realistic photography cues.

No external AI API required.

==================================================

REFERENCE SYSTEM

==================================================

Allow users to upload local reference images.

Show thumbnail previews.

For the demo, uploaded references should be assigned to workflow steps.

Example:

Product Hero

"3 references"

Character Shot

"2 references"

Show reference chips inside nodes.

Do not upload images to a backend.

Use browser/local state only.

==================================================

PROJECTS PAGE

==================================================

Create /projects.

Title:

"Projects"

Show example project cards:

Luxury Watch Campaign

Instagram Ad

4 steps

Balanced

Streetwear Launch

TikTok Campaign

5 steps

Fast

Automotive Film

Brand Film

6 steps

Best

Each card:

small visual placeholder

project name

type

number of steps

last edited

Open button

Create new project button.

==================================================

HOME DEMO EXAMPLES

==================================================

Below the main input show:

"Start with an example"

Three clickable examples:

"LUXURY PRODUCT"

"Create a cinematic 20-second watch ad with product references."

"FASHION CAMPAIGN"

"Create a vertical fashion campaign with a consistent model across multiple scenes."

"PRODUCT LAUNCH"

"Create a product launch video with hero shots, lifestyle scenes and cinematic motion."

Clicking one should populate the brief input.

==================================================

POLISH / INTERACTIONS

==================================================

Use tasteful micro-interactions.

Buttons should have:

- hover states

- subtle scale/opacity transitions

- loading states

Cards should have subtle hover elevation.

Workflow nodes should animate into place when generated.

Use toast notifications.

Examples:

"Workflow created"

"Prompt copied"

"Step updated"

"Model selected"

"Workflow saved"

Do NOT over-animate.

==================================================

EMPTY STATES

==================================================

Make every important state polished.

No workflow:

"Your workflow will appear here."

No projects:

"Your creative projects will appear here."

No references:

"No references added yet."

==================================================

TECHNICAL REQUIREMENTS

==================================================

Use React + TypeScript.

Use Tailwind CSS.

Use shadcn/ui where appropriate.

Use Lucide icons.

Use clean component architecture.

Use local state only.

No backend required.

No authentication required.

No external API calls.

No API keys.

No fake API latency except visual demo loading.

The entire prototype must run immediately after generation.

Use URL routing so these pages work:

/

/workflow

/models

/projects

Persist the current demo project in localStorage so refreshing does not destroy it.

Make the app feel like something a real product team could continue building.

==================================================

CRITICAL PRODUCT PRINCIPLE

==================================================

The central experience should NOT feel like:

"Here are 20 AI models. Pick one."

It should feel like:

"I told the Creative Director what I want.

It understood the creative goal.

It broke the work into steps.

It chose appropriate tools.

It explained its decisions.

Now I can build."

The product's strongest moment should be:

BRIEF

↓

"Analyzing..."

↓

CREATIVE PLAN

↓

VISUAL WORKFLOW

↓

MODEL RECOMMENDATIONS

↓

PROMPTS

Make this flow extremely polished.

==================================================

DEMO COPY

==================================================

Use this exact hero headline:

"Turn a creative brief

into the right AI workflow."

Use this supporting copy:

"Describe what you're trying to make. Creative Director breaks it into shots, recommends the right models, and gives you the prompts to build it."

Primary CTA:

"Build my workflow →"

Workflow heading:

"Your creative workflow"

Workflow subheading:

"Built from your brief. You can edit every step."

Model page heading:

"Models"

Model page subheading:

"Choose by creative outcome, not just model name."

==================================================

FINAL QUALITY BAR

==================================================

This must look like a serious product prototype suitable for showing to a startup founder.

Prioritize:

1. Exceptional UX

2. Clear product thinking

3. Visual polish

4. Functional interactions

5. Strong workflow visualization

6. Realistic model recommendation experience

Avoid:

- generic AI chatbot appearance

- excessive text

- unnecessary dashboards

- fake statistics

- fake customer testimonials

- pricing pages

- login/signup

- unnecessary backend

- generic landing-page sections

The product should feel like a focused creative tool, not a marketing website.

Build the complete working prototype now.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://creative-director08.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/fe6d0f4c-3a28-4f1b-bf42-80f2559e5def).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
