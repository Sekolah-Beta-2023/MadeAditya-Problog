<template>
  <div class="p-8">
    <h1 class="text-3xl font-semibold">Welcome to your dashboard, {{ $auth.user.name }} 👋</h1>
  </div>
</template>
<script>
export default {
  middleware: 'auth',
  layout: 'dashboard'
}
</script>