import { Folder, Gallery } from '../database/entities';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  RemoveEvent,
  DataSource,
} from 'typeorm';

@EventSubscriber()
export class FolderSubscriber implements EntitySubscriberInterface<Folder> {
  constructor(private dataSource: DataSource) {
    this.dataSource.subscribers.push(this);
  }

  listenTo() {
    return Folder;
  }

  async beforeRemove(event: RemoveEvent<Folder>): Promise<void> {
    const galleryRepository = event.manager.getRepository(Gallery);

    const galleries = await galleryRepository.find({
      where: { parent: event.entity },
    });

    for (const gallery of galleries) {
      gallery.parent = null;
      await galleryRepository.save(gallery);
      await galleryRepository.softDelete(gallery.id);
    }
  }
}
