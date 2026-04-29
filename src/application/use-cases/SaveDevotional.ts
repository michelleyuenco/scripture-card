import type { Result } from '@shared/result';
import { err, isErr, ok } from '@shared/result';
import type { DomainError } from '@domain/errors';
import { Devotional } from '@domain/entities';
import { DayKey } from '@domain/value-objects';
import type { DevotionalRepository } from '@domain/repositories';
import type { DevotionalDTO, DevotionalInputDTO } from '@application/dto';
import { toDevotionalDTO } from '@application/mappers/devotionalMapper';
import type { UseCase } from './UseCase';

export class SaveDevotional implements UseCase<DevotionalInputDTO, DevotionalDTO> {
  private readonly repo: DevotionalRepository;

  constructor(repo: DevotionalRepository) {
    this.repo = repo;
  }

  async execute(input: DevotionalInputDTO): Promise<Result<DevotionalDTO, DomainError>> {
    const keyResult = DayKey.create(input.month, input.day);
    if (isErr(keyResult)) return err(keyResult.error);

    const entity = Devotional.create({
      key: keyResult.value,
      dateLabel: input.dateLabel,
      dateEn: input.dateEn,
      title: input.title,
      verseRef: input.verseRef,
      verseTrans: input.verseTrans,
      verse: input.verse,
      body: input.body,
      reflection: input.reflection,
    });
    if (isErr(entity)) return err(entity.error);

    const saved = await this.repo.save(entity.value);
    if (isErr(saved)) return err(saved.error);

    return ok(toDevotionalDTO(saved.value));
  }
}
