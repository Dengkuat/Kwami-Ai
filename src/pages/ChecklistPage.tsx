import { useState } from 'react'
import AppShell from '../components/layout/AppShell'
import { useAppDispatch, useAppSelector } from '../hooks'
import {
  addChecklist,
  addItem,
  clearCompleted,
  deleteChecklist,
  editItem,
  removeItem,
  renameChecklist,
  toggleItem,
  type Checklist,
} from '../store/checklistSlice'
import './ChecklistPage.css'

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6 7h12l-1 13H7L6 7zm3-3h6l1 2H8l1-2zM4 6h16v1H4V6z" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12.5 10 17.5 19 7"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChecklistCard({ list }: { list: Checklist }) {
  const dispatch = useAppDispatch()
  const [newItem, setNewItem] = useState('')

  const total = list.items.length
  const done = list.items.filter((i) => i.done).length
  const progress = total === 0 ? 0 : Math.round((done / total) * 100)

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()
    const text = newItem.trim()
    if (!text) return
    dispatch(addItem({ listId: list.id, text }))
    setNewItem('')
  }

  return (
    <section className="cl-card">
      <div className="cl-card-head">
        <input
          className="cl-title-input"
          value={list.title}
          aria-label="Checklist title"
          onChange={(e) => dispatch(renameChecklist({ listId: list.id, title: e.target.value }))}
        />
        <button
          type="button"
          className="cl-icon-btn cl-danger"
          aria-label="Delete checklist"
          onClick={() => dispatch(deleteChecklist(list.id))}
        >
          <TrashIcon />
        </button>
      </div>

      <div className="cl-progress-row">
        <span className="cl-progress-label">
          {done}/{total} done
        </span>
        <span className="cl-progress-badge">{progress}%</span>
      </div>
      <div className="cl-progress-bar">
        <div className="cl-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <ul className="cl-items">
        {list.items.map((item) => (
          <li key={item.id} className={`cl-item ${item.done ? 'is-done' : ''}`}>
            <button
              type="button"
              className="cl-check"
              role="checkbox"
              aria-checked={item.done}
              aria-label={item.done ? 'Mark as not done' : 'Mark as done'}
              onClick={() => dispatch(toggleItem({ listId: list.id, itemId: item.id }))}
            >
              {item.done && <CheckIcon />}
            </button>
            <input
              className="cl-item-input"
              value={item.text}
              aria-label="Checklist item"
              onChange={(e) =>
                dispatch(editItem({ listId: list.id, itemId: item.id, text: e.target.value }))
              }
            />
            <button
              type="button"
              className="cl-icon-btn cl-item-remove"
              aria-label="Remove item"
              onClick={() => dispatch(removeItem({ listId: list.id, itemId: item.id }))}
            >
              ×
            </button>
          </li>
        ))}
        {list.items.length === 0 && <li className="cl-empty-items">No items yet. Add one below.</li>}
      </ul>

      <form className="cl-add-item" onSubmit={handleAddItem}>
        <input
          className="cl-add-input"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add an item…"
        />
        <button type="submit" className="cl-add-btn" aria-label="Add item" disabled={!newItem.trim()}>
          <PlusIcon />
        </button>
      </form>

      {done > 0 && (
        <button
          type="button"
          className="cl-clear-btn"
          onClick={() => dispatch(clearCompleted(list.id))}
        >
          Clear completed ({done})
        </button>
      )}
    </section>
  )
}

function ChecklistPage() {
  const dispatch = useAppDispatch()
  const lists = useAppSelector((state) => state.checklist.lists)
  const [newTitle, setNewTitle] = useState('')

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    const title = newTitle.trim()
    if (!title) return
    dispatch(addChecklist({ title }))
    setNewTitle('')
  }

  return (
    <AppShell>
      <div className="cl-body">
        <div className="cl-page-head">
          <h2 className="cl-page-title">My Checklists</h2>
          <span className="cl-tag">{lists.length}</span>
        </div>

        <form className="cl-create" onSubmit={handleCreate}>
          <input
            className="cl-create-input"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="New checklist title…"
          />
          <button type="submit" className="cl-create-btn" disabled={!newTitle.trim()}>
            <PlusIcon />
            <span>Add</span>
          </button>
        </form>

        {lists.length === 0 ? (
          <div className="cl-empty">
            <p>No checklists yet.</p>
            <p className="cl-empty-hint">Create one above to start tracking your documents.</p>
          </div>
        ) : (
          <div className="cl-list-stack">
            {lists.map((list) => (
              <ChecklistCard key={list.id} list={list} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}

export default ChecklistPage
