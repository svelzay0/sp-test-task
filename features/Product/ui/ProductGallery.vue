<template>
  <v-dialog
    :model-value="modelValue"
    max-width="900"
    transition="dialog-bottom-transition"
    @update:model-value="closeModal"
  >
    <v-card rounded="xl">
      <v-toolbar color="rgba(0, 0, 0, 0.3)" density="compact">
        <h4 class="pa-4">{{ title }}</h4>

        <v-spacer />
        <v-btn icon="mdi-close" @click="closeModal" />
      </v-toolbar>

      <v-card-text class="d-flex flex-column align-center justify-center pa-0">
        <div class="image-container d-flex align-center justify-center">
          <v-img
            v-if="currentItem"
            :src="currentItem"
            :alt="`Image ${currentIndex + 1}`"
            class="main-image"
            :style="transformStyle"
            @click="handleImageClick"
            @mousedown.prevent="startDrag"
            @mousemove="doDrag"
            @mouseup="stopDrag"
            @mouseleave="stopDrag"
          >
            <template #placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular color="grey-lighten-4" indeterminate />
              </div>
            </template>
          </v-img>
        </div>

        <div class="thumbnails-wrapper">
          <v-slide-group v-model="currentIndex" center-active show-arrows>
            <template #prev>
              <v-btn
                class="mx-1"
                icon="mdi-chevron-left"
                variant="tonal"
                @click="prevSlide"
              />
            </template>
            <template #next>
              <v-btn
                class="mx-1"
                icon="mdi-chevron-right"
                variant="tonal"
                @click="nextSlide"
              />
            </template>

            <v-slide-group-item
              v-for="(image, i) in images"
              :key="i"
              v-slot="{ isSelected, toggle }"
            >
              <v-card
                :color="isSelected ? 'primary' : 'grey-darken-3'"
                class="ma-2 thumbnail-card"
                height="60"
                width="60"
                @click="toggle"
              >
                <v-img :src="image" cover class="fill-height" />
              </v-card>
            </v-slide-group-item>
          </v-slide-group>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";

// --- Props & Emits ---
const props = defineProps<{
  title: string;
  modelValue: boolean;
  images: string[];
  initialIndex: number;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const currentIndex = ref(props.initialIndex);
const currentItem = computed(() => props.images[currentIndex.value] ?? null);

watch(
  () => props.initialIndex,
  (newIndex) => {
    currentIndex.value = newIndex;
  }
);

const zoomed = ref(false);
const isDragging = ref(false);
const isClick = ref(true);
const startPos = ref({ x: 0, y: 0 });
const currentOffset = ref({ x: 0, y: 0 });

const transformStyle = computed(() => ({
  transform: `scale(${zoomed.value ? 2 : 1}) translate(${
    currentOffset.value.x
  }px, ${currentOffset.value.y}px)`,
  cursor: zoomed.value ? "grab" : "zoom-in",
  transition: isDragging.value ? "none" : "transform 0.24s ease",
}));

function handleImageClick() {
  if (isClick.value) toggleZoom();
  isClick.value = true;
}

function toggleZoom() {
  zoomed.value = !zoomed.value;
  if (!zoomed.value) currentOffset.value = { x: 0, y: 0 };
}

function startDrag(e: MouseEvent) {
  if (!zoomed.value) return;
  isDragging.value = true;
  isClick.value = true;
  startPos.value = { x: e.clientX, y: e.clientY };
}

function doDrag(e: MouseEvent) {
  if (!isDragging.value || !zoomed.value) return;
  const dx = e.clientX - startPos.value.x;
  const dy = e.clientY - startPos.value.y;
  if (Math.abs(dx) > 5 || Math.abs(dy) > 5) isClick.value = false;

  currentOffset.value.x += dx / 2; // Делим на 2, т.к. scale(2)
  currentOffset.value.y += dy / 2;
  startPos.value = { x: e.clientX, y: e.clientY };
}

function stopDrag() {
  isDragging.value = false;
}
function nextSlide() {
  currentIndex.value = (currentIndex.value + 1) % props.images.length;
  zoomed.value = false;
}

function prevSlide() {
  currentIndex.value =
    (currentIndex.value - 1 + props.images.length) % props.images.length;
  zoomed.value = false;
}

function closeModal() {
  zoomed.value = false;
  emit("update:modelValue", false);
}
</script>

<style scoped>
.image-container {
  width: 100%;
  height: calc(100% - 120px);
  overflow: hidden;
  position: relative;
}
.main-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.thumbnails-wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  padding: 16px 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
}
.thumbnail-card {
  transition: all 0.2s ease-in-out;
}
</style>
