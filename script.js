const arrayContainer = document.getElementById('arrayContainer');
const sizeSlider = document.getElementById('arraySize');
const sizeValue = document.getElementById('sizeValue');
const randomizeBtn = document.getElementById('randomize');
const stepBtn = document.getElementById('step');
const playBtn = document.getElementById('play');
const resetBtn = document.getElementById('reset');
const stepDesc = document.getElementById('stepDescription');
const stepNum = document.getElementById('stepNumber');

let array = [];
let steps = [];        
let currentStep = 0;
let playInterval = null;
let isPlaying = false;

function init() {
    const size = parseInt(sizeSlider.value);
    array = generateRandomArray(size);
    steps = generateSteps(array);
    currentStep = 0;
    renderStep();
    updateStepInfo();
}

function generateRandomArray(size) {
    return Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
}

function merge(left, right) {
    let result = [];
    let i = 0, j = 0;
    while (i < left.length && j < right.length) {
        if (left[i] < right[j]) {
            result.push(left[i++]);
        } else {
            result.push(right[j++]);
        }
    }
    return result.concat(left.slice(i)).concat(right.slice(j));
}

function recordSteps(arr, leftIdx, rightIdx, globalSteps, globalArray) {
    if (leftIdx === rightIdx) return; 

    const mid = Math.floor((leftIdx + rightIdx) / 2);

    globalSteps.push({
        array: globalArray.slice(),           
        left: leftIdx,
        mid: mid,
        right: rightIdx,
        type: 'divide',
        description: `Divide [${leftIdx}–${rightIdx}] into [${leftIdx}–${mid}] and [${mid+1}–${rightIdx}]`
    });

    recordSteps(arr, leftIdx, mid, globalSteps, globalArray);

    recordSteps(arr, mid + 1, rightIdx, globalSteps, globalArray);

    const leftPart = globalArray.slice(leftIdx, mid + 1);
    const rightPart = globalArray.slice(mid + 1, rightIdx + 1);
    const merged = merge(leftPart, rightPart);

    for (let i = 0; i < merged.length; i++) {
        globalArray[leftIdx + i] = merged[i];
    }

    globalSteps.push({
        array: globalArray.slice(),
        left: leftIdx,
        mid: mid,
        right: rightIdx,
        type: 'merge',
        description: `Merge [${leftIdx}–${mid}] and [${mid+1}–${rightIdx}]`
    });
}

function generateSteps(originalArr) {
    let steps = [];
    let workingArray = originalArr.slice();

    steps.push({
        array: workingArray.slice(),
        left: -1,
        mid: -1,
        right: -1,
        type: 'initial',
        description: 'Initial array'
    });

    recordSteps(workingArray, 0, workingArray.length - 1, steps, workingArray);

    return steps;
}

function renderStep() {
    const step = steps[currentStep];
    const arr = step.array;

    arrayContainer.innerHTML = '';
    arr.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.className = 'array-bar';
        bar.textContent = value;
        bar.style.height = (value * 2) + 'px';
        bar.style.lineHeight = (value * 2) + 'px';

        if (step.type === 'divide') {
            if (index >= step.left && index <= step.mid) {
                bar.style.background = '#3498db'; 
            } else if (index >= step.mid + 1 && index <= step.right) {
                bar.style.background = '#e67e22'; 
            }
        } else if (step.type === 'merge') {
            if (index >= step.left && index <= step.right) {
                bar.style.background = '#f1c40f';
                bar.style.color = '#2c3e50';
            }
        } else if (step.type === 'initial') {
            // No special highlight
        }

        arrayContainer.appendChild(bar);
    });

    stepDesc.textContent = step.description;
    stepNum.textContent = `Step ${currentStep} / ${steps.length - 1}`;
}

function updateStepInfo() {
    const step = steps[currentStep];
    stepDesc.textContent = step.description;
    stepNum.textContent = `Step ${currentStep} / ${steps.length - 1}`;
}

function nextStep() {
    if (currentStep < steps.length - 1) {
        currentStep++;
        renderStep();
    } else {
        if (isPlaying) stopPlay();
    }
}

function resetToStart() {
    if (isPlaying) stopPlay();
    currentStep = 0;
    renderStep();
}

function startPlay() {
    if (isPlaying) return;
    if (currentStep >= steps.length - 1) {
        resetToStart();
    }
    isPlaying = true;
    playBtn.textContent = '⏸️ Pause';
    playInterval = setInterval(() => {
        if (currentStep < steps.length - 1) {
            nextStep();
        } else {
            stopPlay();
        }
    }, 1000);
}

function stopPlay() {
    if (playInterval) {
        clearInterval(playInterval);
        playInterval = null;
    }
    isPlaying = false;
    playBtn.textContent = '▶️ Play';
}

const langBtns = document.querySelectorAll('.lang-btn');
const codeBlock = document.getElementById('code-block');

const codeSnippets = {
    c: `// Merge Sort in C
#include <stdio.h>

void merge(int arr[], int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;
    int L[n1], R[n2];

    for (int i = 0; i < n1; i++) L[i] = arr[left + i];
    for (int j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];

    int i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) arr[k++] = L[i++];
        else arr[k++] = R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}

void mergeSort(int arr[], int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}`,

    cpp: `// Merge Sort in C++
#include <iostream>
#include <vector>
using namespace std;

void merge(vector<int>& arr, int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;
    vector<int> L(n1), R(n2);

    for (int i = 0; i < n1; i++) L[i] = arr[left + i];
    for (int j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];

    int i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) arr[k++] = L[i++];
        else arr[k++] = R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}

void mergeSort(vector<int>& arr, int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}`,

    java: `// Merge Sort in Java
public class MergeSort {
    void merge(int arr[], int left, int mid, int right) {
        int n1 = mid - left + 1;
        int n2 = right - mid;
        int L[] = new int[n1];
        int R[] = new int[n2];

        for (int i = 0; i < n1; i++) L[i] = arr[left + i];
        for (int j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];

        int i = 0, j = 0, k = left;
        while (i < n1 && j < n2) {
            if (L[i] <= R[j]) arr[k++] = L[i++];
            else arr[k++] = R[j++];
        }
        while (i < n1) arr[k++] = L[i++];
        while (j < n2) arr[k++] = R[j++];
    }

    void mergeSort(int arr[], int left, int right) {
        if (left < right) {
            int mid = left + (right - left) / 2;
            mergeSort(arr, left, mid);
            mergeSort(arr, mid + 1, right);
            merge(arr, left, mid, right);
        }
    }
}`,

    python: `# Merge Sort in Python
def merge(arr, left, mid, right):
    L = arr[left:mid+1]
    R = arr[mid+1:right+1]
    i = j = 0
    k = left
    while i < len(L) and j < len(R):
        if L[i] <= R[j]:
            arr[k] = L[i]
            i += 1
        else:
            arr[k] = R[j]
            j += 1
        k += 1
    while i < len(L):
        arr[k] = L[i]
        i += 1
        k += 1
    while j < len(R):
        arr[k] = R[j]
        j += 1
        k += 1

def mergeSort(arr, left, right):
    if left < right:
        mid = (left + right) // 2
        mergeSort(arr, left, mid)
        mergeSort(arr, mid + 1, right)
        merge(arr, left, mid, right)`,

    javascript: `// Merge Sort in JavaScript
function merge(arr, left, mid, right) {
    const L = arr.slice(left, mid + 1);
    const R = arr.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;
    while (i < L.length && j < R.length) {
        if (L[i] <= R[j]) arr[k++] = L[i++];
        else arr[k++] = R[j++];
    }
    while (i < L.length) arr[k++] = L[i++];
    while (j < R.length) arr[k++] = R[j++];
}

function mergeSort(arr, left = 0, right = arr.length - 1) {
    if (left < right) {
        const mid = Math.floor((left + right) / 2);
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}`
};

codeBlock.textContent = codeSnippets.c;

langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        langBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const lang = btn.getAttribute('data-lang');
        codeBlock.textContent = codeSnippets[lang];
    });
});

sizeSlider.addEventListener('input', (e) => {
    sizeValue.textContent = e.target.value;
    if (isPlaying) stopPlay();
    init();
});

randomizeBtn.addEventListener('click', () => {
    if (isPlaying) stopPlay();
    init();
});

stepBtn.addEventListener('click', () => {
    if (isPlaying) stopPlay();
    if (currentStep < steps.length - 1) {
        nextStep();
    }
});

playBtn.addEventListener('click', () => {
    if (isPlaying) {
        stopPlay();
    } else {
        startPlay();
    }
});

resetBtn.addEventListener('click', () => {
    if (isPlaying) stopPlay();
    resetToStart();
});

init();