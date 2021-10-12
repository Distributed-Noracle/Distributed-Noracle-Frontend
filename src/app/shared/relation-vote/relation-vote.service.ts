import {Injectable} from '@angular/core';
import {RelationVote} from '../rest-data-model/relation-vote';
import {RestHelperService} from '../rest-helper/rest-helper.service';

@Injectable()
export class RelationVoteService {

  constructor(private restHelperService: RestHelperService) {
  }

  public getRelationVotes(spaceId: string, relationId: string) {
    return this.restHelperService.get(`/spaces/${spaceId}/relations/${relationId}/votes`).then((res: RelationVote[]) => {
      return res;
    });
  }

  public putRelationVote(spaceId: string, relationId: string, agentId: string,
                         questionVote: RelationVote): Promise<RelationVote> {
    return this.restHelperService.put(`/spaces/${spaceId}/relations/${relationId}/votes/${agentId}`, questionVote)
      .then((r) => r.json() as RelationVote);
  }
}
