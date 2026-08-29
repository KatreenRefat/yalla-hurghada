import { useBooking } from "../../../context/BookingContext";
import { useLanguage } from "../../../context/useLanguage";
import { TIERS, TIER_ICONS } from "../../../data/bookingRewardsData";
import Badge from "../../common/Badge/Badge";
import "./RewardsPanel.css";

const content = {
  EN: {
    heading: "Rewards & Promo Codes",
    currentPoints: "Current Points",
    ptsToNext: (n, name, min) => `${n} points to ${name} (${min} pts)`,
    maxTier: "Max tier reached!",
    traveler: (tier) => `◈ ${tier} Traveler`,
    nextReward: "Next Reward",
    unlockDiscount: (n) => `Unlock ${n}% Discount`,
    remaining: (n) => `${n} points remaining`,
  },
  AR: {
    heading: "المكافآت وأكواد الخصم",
    currentPoints: "النقاط الحالية",
    ptsToNext: (n, name, min) => `${n} نقطة للوصول إلى ${name} (${min} نقطة)`,
    maxTier: "وصلت للمستوى الأعلى!",
    traveler: (tier) => `◈ مسافر ${tier}`,
    nextReward: "المكافأة التالية",
    unlockDiscount: (n) => `احصل على خصم ${n}%`,
    remaining: (n) => `${n} نقطة متبقية`,
  },
  RU: {
    heading: "Награды и промокоды",
    currentPoints: "Текущие баллы",
    ptsToNext: (n, name, min) => `${n} баллов до ${name} (${min} баллов)`,
    maxTier: "Достигнут максимальный уровень!",
    traveler: (tier) => `◈ Путешественник ${tier}`,
    nextReward: "Следующая награда",
    unlockDiscount: (n) => `Скидка ${n}%`,
    remaining: (n) => `Осталось ${n} баллов`,
  },
};

export default function RewardsPanel() {
  const { points, getTier, getNextTier, getTierProgress } = useBooking();
  const { language } = useLanguage();
  const t = content[language] || content.EN;

  const tier = getTier();
  const nextTier = getNextTier();
  const tierPct = getTierProgress();
  const ptsToNext = nextTier ? nextTier.min - points : 0;
  const nextTierIndex = nextTier ? TIERS.indexOf(nextTier) : -1;

  return (
    <div className="rewards-panel">
      <div className="rewards-panel__header">
        <span className="rewards-panel__icon">🎁</span>
        <span className="rewards-panel__heading">{t.heading}</span>
      </div>

      <div className="rewards-panel__card">
        <div className="rewards-panel__points-row">
          <span className="rewards-panel__points-label">{t.currentPoints}</span>
          <span className="rewards-panel__points-value">⭐ {points}</span>
        </div>
        <div className="rewards-panel__progress-track">
          <div
            className="rewards-panel__progress-fill"
            style={{ width: `${tierPct}%` }}
          />
        </div>
        <div className="rewards-panel__progress-text">
          {ptsToNext > 0
            ? t.ptsToNext(ptsToNext, nextTier?.name, nextTier?.min)
            : t.maxTier}
        </div>
        <Badge color="#64748b">{t.traveler(tier.name)}</Badge>
      </div>

      <div className="rewards-panel__tiers">
        {TIERS.map(tier => (
          <div
            key={tier.name}
            className={`rewards-panel__tier ${points >= tier.min ? "rewards-panel__tier--unlocked" : ""}`}
          >
            <div className="rewards-panel__tier-icon">{TIER_ICONS[tier.name]}</div>
            <div className="rewards-panel__tier-name">{tier.name}</div>
            <div className="rewards-panel__tier-range">
              {tier.min}-{tier.max === Infinity ? "∞" : tier.max}
            </div>
          </div>
        ))}
      </div>

      {nextTier && (
        <div className="rewards-panel__next-reward">
          <span className="rewards-panel__next-icon">🎯</span>
          <div>
            <div className="rewards-panel__next-title">{t.nextReward}</div>
            <div className="rewards-panel__next-desc">
              {t.unlockDiscount(nextTierIndex * 5)}
            </div>
            <div className="rewards-panel__next-remaining">
              {t.remaining(ptsToNext)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}