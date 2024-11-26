
class QNode<T> {
    value: T;
    next: QNode<T> | null = null;

    constructor(value: T){
        this.value = value;
    }
}

export class LinkedQueue<T> {
    private head: QNode<T> | null = null;
    private tail: QNode<T> | null = null;
    private length: number = 0;

    // Add an element to the end of the queue
    enqueue(item: T): void {
        const newNode = new QNode(item);
        if (!this.tail) {
        this.head = this.tail = newNode;
        } else {
        this.tail.next = newNode;
        this.tail = newNode;
        }
        this.length++;
    }

    // Remove and return the element from the front of the queue
    dequeue(): T | undefined {
        if (!this.head) return undefined;
        const value = this.head.value;
        this.head = this.head.next;
        if (!this.head) this.tail = null;
        this.length--;
        return value;
    }

    // Peek at the element at the front of the queue without removing it
    peek(): T | undefined {
        return this.head?.value;
    }

    // Check if the queue is empty
    isEmpty(): boolean {
        return this.length === 0;
    }

    // Get the size of the queue
    size(): number {
        return this.length;
    }
}

