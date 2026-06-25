import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-borderSoft bg-white">
      <div className="grid w-full gap-10 px-4 py-14 md:grid-cols-[1fr,1.1fr,1fr] md:px-8">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#8c837b]">Помощь</p>
          <div className="mt-5 space-y-3 text-sm text-[#524b45]">
            <Link href="/shop" className="block">
              Возврат
            </Link>
            <span className="block">Отследить заказ</span>
            <span className="block">Размерная сетка</span>
            <span className="block">Доставка</span>
            <span className="block">Вопросы и ответы</span>
            <span className="block">Связаться с нами</span>
          </div>
        </div>
        <div className="text-center">
          <p className="font-display text-[34px] tracking-[0.05em] text-[#231f1b]">Будьте в курсе</p>
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#6b645d]">
            Узнавайте первыми о новых дропах, посадке и базовых моделях YANXINNA на каждый день.
          </p>
          <form className="mx-auto mt-8 flex max-w-md items-stretch">
            <input
              type="email"
              placeholder="ваш email"
              className="h-12 flex-1 border border-borderSoft px-4 text-sm text-[#231f1b] outline-none"
            />
            <button
              type="submit"
              className="flex h-12 items-center justify-center border border-l-0 border-[#231f1b] bg-[#231f1b] px-5 text-white transition hover:bg-[#342f2a]"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
          <p className="mx-auto mt-5 max-w-lg text-xs leading-6 text-[#8b837b]">
            Отправляя email, вы соглашаетесь получать маркетинговые сообщения. Условия и политика конфиденциальности.
          </p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#8c837b]">Еще</p>
          <div className="mt-5 space-y-3 text-sm text-[#524b45]">
            <span className="block">О бренде</span>
            <span className="block">Бонусы</span>
            <span className="block">Подарочные карты</span>
            <span className="block">Магазины</span>
            <span className="block">Партнеры</span>
            <span className="block">Карьера</span>
            <span className="block">Журнал</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
