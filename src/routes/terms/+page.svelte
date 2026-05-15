<script lang="ts">
  import Seo from '$lib/components/seo.svelte';
</script>

<Seo title="Terms of Service" />

<div class="flex w-full max-w-4xl flex-col items-center gap-6 px-4 pt-10 pb-12 text-left sm:gap-8 sm:pt-16 sm:pb-16 mx-auto my-auto">
  <div class="mb-2 flex w-full flex-col gap-3 rounded-4xl border border-border bg-card p-5 text-left shadow-lg sm:p-8">
    <p class="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">Ground rules</p>
    <h1 class="text-3xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl">
      Terms of <span class="text-primary">Service</span>
    </h1>
  </div>

  <div class="w-full max-w-3xl space-y-6 rounded-4xl border border-border bg-card p-5 text-muted-foreground shadow-lg sm:p-8 font-semibold">
    <section>
      <h2 class="text-2xl font-black text-foreground mb-4 tracking-tight">1. Acceptance of Terms</h2>
      <p>
        By logging into YourSplit using your <strong>Google Account</strong>, you agree to these basic terms. If you do not agree with them, please do not use the service.
      </p>
    </section>

    <section>
      <h2 class="text-2xl font-black text-foreground mb-4 tracking-tight">2. Account Responsibility</h2>
      <p>
        Because we strictly use Google login, you are responsible for maintaining the security of your own Google Account. We are not liable for any unauthorized access to your routines if your primary Google Account is compromised.
      </p>
    </section>

    <section>
      <h2 class="text-2xl font-black text-foreground mb-4 tracking-tight">3. User Content</h2>
      <p>
        You retain full ownership over any workout routines you create. However, by publishing a routine publicly on the platform, you grant us a non-exclusive license to display it to other users. We reserve the right to remove any content that is wildly inappropriate or malicious.
      </p>
    </section>

    <section>
      <h2 class="text-2xl font-black text-foreground mb-4 tracking-tight">4. "As Is" Service</h2>
      <p>
        YourSplit is provided on an "as is" and "as available" basis. While we strive to make it reliable, we do not warrant that the service will be entirely uninterrupted or completely error-free.
      </p>
    </section>
  </div>
</div>
