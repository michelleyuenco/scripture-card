import { type FormEvent, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { DevotionalDTO, DevotionalInputDTO } from '@application/dto';
import { PageFooter, PageHeader } from '@presentation/components';
import { useContainer, useDevotional } from '@presentation/hooks';

const MONTH_CN = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
const MONTH_EN = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

type SaveState =
  | { readonly kind: 'idle' }
  | { readonly kind: 'saving' }
  | { readonly kind: 'saved' }
  | { readonly kind: 'error'; readonly message: string };

export const AdminEditorPage = () => {
  const { month: rawMonth, day: rawDay } = useParams<{ month: string; day: string }>();
  const month = Number(rawMonth);
  const day = Number(rawDay);

  const valid =
    Number.isInteger(month) &&
    Number.isInteger(day) &&
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <= 31;

  if (!valid) {
    return (
      <main className="page page-fit">
        <PageHeader />
        <section className="section-message">
          <h1 className="section-title">無效的日期</h1>
          <Link to="/admin" className="btn-solid">
            回到管理頁
          </Link>
        </section>
      </main>
    );
  }

  return <EditorLoader month={month} day={day} />;
};

const EditorLoader = ({ month, day }: { readonly month: number; readonly day: number }) => {
  const { entry, loading } = useDevotional(month, day);

  if (loading || !entry) {
    return (
      <main className="page page-fit">
        <PageHeader leading={<BackLink />} />
        <div className="loader">載入中…</div>
      </main>
    );
  }

  // `key` forces a fresh Editor instance with rehydrated state when the day changes.
  return <Editor key={entry.key} month={month} day={day} entry={entry} />;
};

interface EditorProps {
  readonly month: number;
  readonly day: number;
  readonly entry: DevotionalDTO;
}

const initialFormFrom = (entry: DevotionalDTO, month: number, day: number): DevotionalInputDTO => {
  const blank = entry.source === 'placeholder';
  return {
    month,
    day,
    dateLabel: entry.dateLabel,
    dateEn: entry.dateEn,
    title: blank ? '' : entry.title,
    verseRef: blank ? '' : entry.verseRef,
    verseTrans: blank ? '' : entry.verseTrans,
    verse: blank ? '' : entry.verse,
    body: blank ? [''] : [...entry.body],
    reflection: blank ? '' : entry.reflection,
  };
};

const Editor = ({ month, day, entry }: EditorProps) => {
  const navigate = useNavigate();
  const container = useContainer();
  const [form, setForm] = useState<DevotionalInputDTO>(() => initialFormFrom(entry, month, day));
  const [bodyText, setBodyText] = useState<string>(() =>
    entry.source === 'placeholder' ? '' : entry.body.join('\n\n'),
  );
  const [save, setSave] = useState<SaveState>({ kind: 'idle' });
  const [deleting, setDeleting] = useState(false);

  const exists = entry.source === 'firestore';
  const isBuiltInDraft = entry.source === 'builtin';

  const update = <K extends keyof DevotionalInputDTO>(key: K, value: DevotionalInputDTO[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = bodyText
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
    if (body.length === 0) {
      setSave({ kind: 'error', message: '請至少輸入一段正文。' });
      return;
    }
    setSave({ kind: 'saving' });
    container.useCases.saveDevotional.execute({ ...form, body }).then(
      (result) => {
        if (result.ok) {
          setSave({ kind: 'saved' });
          setTimeout(() => setSave({ kind: 'idle' }), 2400);
        } else {
          setSave({ kind: 'error', message: result.error.message });
        }
      },
      (error: unknown) => {
        const message = error instanceof Error ? error.message : '未知錯誤';
        setSave({ kind: 'error', message });
      },
    );
  };

  const remove = () => {
    if (deleting) return;
    if (!window.confirm(`確定要刪除 ${MONTH_CN[month - 1] ?? month}月${day}日 的內容嗎？`)) return;
    setDeleting(true);
    container.useCases.deleteDevotional.execute({ month, day }).then(
      (result) => {
        setDeleting(false);
        if (result.ok) {
          void navigate('/admin');
        } else {
          setSave({ kind: 'error', message: result.error.message });
        }
      },
      (error: unknown) => {
        setDeleting(false);
        const message = error instanceof Error ? error.message : '未知錯誤';
        setSave({ kind: 'error', message });
      },
    );
  };

  const subtitle = useMemo(
    () => `${MONTH_CN[month - 1] ?? month}月${day}日 · ${MONTH_EN[month - 1] ?? ''} ${day}`,
    [month, day],
  );

  return (
    <main className="page page-fit">
      <PageHeader leading={<BackLink />} />

      <section className="page-fit-stack section-editor">
        <header className="editor-header">
          <p className="kicker">Editor</p>
          <h1 className="section-title">編輯每日內容</h1>
          <p className="editor-subtitle">
            {subtitle}
            {exists && (
              <span className="status-pill status-pill-filled editor-status-pill">已收錄</span>
            )}
            {isBuiltInDraft && <span className="status-pill editor-status-pill">選錄底稿</span>}
          </p>
          <hr className="gold-rule gold-rule--start editor-rule" />
        </header>

        <form onSubmit={submit} className="editor-form">
          <div className="page-fit-scroll editor-fields">
            <div className="field-grid">
              <label className="field">
                <span className="field-label">中文日期</span>
                <input
                  className="field-control"
                  type="text"
                  value={form.dateLabel}
                  onChange={(e) => update('dateLabel', e.target.value)}
                  required
                  placeholder="例：八月七日"
                />
              </label>
              <label className="field">
                <span className="field-label">英文日期</span>
                <input
                  className="field-control"
                  type="text"
                  value={form.dateEn}
                  onChange={(e) => update('dateEn', e.target.value)}
                  required
                  placeholder="例：August 7"
                />
              </label>
            </div>

            <label className="field">
              <span className="field-label">當日標題</span>
              <input
                className="field-control"
                type="text"
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                required
                placeholder="例：祝福那反對你的人"
              />
            </label>

            <div className="field-grid">
              <label className="field">
                <span className="field-label">經文出處</span>
                <input
                  className="field-control"
                  type="text"
                  value={form.verseRef}
                  onChange={(e) => update('verseRef', e.target.value)}
                  required
                  placeholder="例：使徒行傳 2:44–45"
                />
              </label>
              <label className="field">
                <span className="field-label">譯本</span>
                <input
                  className="field-control"
                  type="text"
                  value={form.verseTrans}
                  onChange={(e) => update('verseTrans', e.target.value)}
                  placeholder="例：新譯本"
                />
              </label>
            </div>

            <label className="field">
              <span className="field-label">經文內容</span>
              <textarea
                className="field-control"
                value={form.verse}
                onChange={(e) => update('verse', e.target.value)}
                required
                rows={3}
                placeholder="輸入完整經文內容…"
              />
            </label>

            <label className="field">
              <span className="field-label">靈修正文</span>
              <textarea
                className="field-control"
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                required
                rows={12}
                placeholder="以空白行分隔每一段。"
              />
              <span className="field-help">空白行（一個 Enter 鍵兩次）會分段。</span>
            </label>

            <label className="field">
              <span className="field-label">反思問題</span>
              <textarea
                className="field-control"
                value={form.reflection}
                onChange={(e) => update('reflection', e.target.value)}
                rows={3}
                placeholder="留給讀者一個反思問題。"
              />
            </label>

            {save.kind === 'error' && (
              <div className="banner banner-error" role="alert">
                {save.message}
              </div>
            )}
            {save.kind === 'saved' && (
              <div className="banner banner-info" role="status">
                已儲存 ✓
              </div>
            )}
          </div>

          <div className="page-fit-actions page-fit-actions--between">
            <button
              type="button"
              onClick={remove}
              className="btn-ghost editor-action-danger"
              disabled={!exists || deleting}
            >
              {deleting ? '刪除中…' : '刪除此日'}
            </button>
            <div className="editor-action-end">
              <Link to="/admin" className="btn-outline">
                取消
              </Link>
              <button type="submit" className="btn-solid" disabled={save.kind === 'saving'}>
                {save.kind === 'saving' ? '儲存中…' : '儲存內容 →'}
              </button>
            </div>
          </div>
        </form>
      </section>

      <PageFooter />
    </main>
  );
};

const BackLink = () => (
  <Link to="/admin" className="btn-ghost">
    ← &nbsp;返回列表
  </Link>
);
