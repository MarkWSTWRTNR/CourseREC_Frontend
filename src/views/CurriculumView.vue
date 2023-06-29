<template>
  <div>
    <div v-for="(item, index) in items" :key="index">
      <div @click="toggleAccordion(index)" :class="{'active': isActive(index)}">
        <h3>{{ item.title }}</h3>
        <i class="fa fa-chevron-down" :class="{'fa-rotate-180': isActive(index)}"></i>
      </div>
      <div v-show="isActive(index)" class="content">
        <!-- Content for each accordion item -->
        <p>{{ item.content }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { title: 'Curriculum structure', content: 'Content for Accordion Item 1' },
        { title: 'Study plan', content: 'Content for Accordion Item 2' },
      ],
      activeIndices: []
    };
  },
  methods: {
    toggleAccordion(index) {
      if (this.isActive(index)) {
        this.activeIndices = this.activeIndices.filter(i => i !== index); // Remove index if already active
      } else {
        this.activeIndices.push(index); // Add index if not active
      }
    },
    isActive(index) {
      return this.activeIndices.includes(index);
    }
  }
};
</script>

<style>
.active {
  background-color: #f0f0f0;
}

.content {
  padding: 10px;
}
</style>
