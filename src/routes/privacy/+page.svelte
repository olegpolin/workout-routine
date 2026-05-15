<script lang="ts">
  import Seo from '$lib/components/seo.svelte';
</script>

<Seo title="Privacy Policy" />

<div class="flex w-full max-w-4xl flex-col items-center gap-6 px-4 pt-10 pb-12 text-left sm:gap-8 sm:pt-16 sm:pb-16 mx-auto my-auto">
  <div class="mb-2 flex w-full flex-col gap-3 rounded-4xl border border-border bg-card p-5 text-left shadow-lg sm:p-8">
    <p class="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">Your data</p>
    <h1 class="text-3xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl">
      Privacy <span class="text-primary">Policy</span>
    </h1>
  </div>

  <div class="w-full max-w-3xl space-y-6 rounded-4xl border border-border bg-card p-5 text-muted-foreground shadow-lg sm:p-8 font-semibold">
    <section>
      <h2 class="text-2xl font-black text-foreground mb-4 tracking-tight">1. Information We Collect</h2>
      <p>
        We keep it as simple as possible. The only personal information we collect is from your <strong>Google Account</strong> when you log in. This includes your email address, name, and profile picture provided by Google.
      </p>
    </section>

    <section>
      <h2 class="text-2xl font-black text-foreground mb-4 tracking-tight">2. How We Use Your Information</h2>
      <p>
        We use this information exclusively to:
      </p>
      <ul class="list-disc pl-6 mt-2 space-y-2">
        <li>Authenticate your identity securely.</li>
        <li>Associate your custom workout routines with your specific profile.</li>
        <li>Display your name or avatar next to routines you choose to share publicly.</li>
      </ul>
    </section>

    <section>
      <h2 class="text-2xl font-black text-foreground mb-4 tracking-tight">3. Data Sharing and Protection</h2>
      <p>
        <strong>We do not sell, rent, or share your personal data with third parties.</strong> Your data is structurally secured and used solely for the necessary functionality of YourSplit. Since we rely on Google for authentication, your passwords are never seen or stored by us.
      </p>
    </section>

    <section>
      <h2 class="text-2xl font-black text-foreground mb-4 tracking-tight">4. Your Rights</h2>
      <p>
        You hold the right to delete your account and all associated workout routines from our database at any time. Simply sign out and reach out to us if you need full data removal.
      </p>
    </section>
  </div>
</div>
