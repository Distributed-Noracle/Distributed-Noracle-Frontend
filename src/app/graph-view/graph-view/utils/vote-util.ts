import { Vote } from './../../../shared/rest-data-model/vote';

export class VoteUtil {
    public static countVotes(votes: Vote[]): {good: number, neutral: number, bad: number, total: number} {
    let good = 0;
    let neutral = 0;
    let bad = 0;
    votes.forEach(vote => {
      switch (vote.value) {
        case -1:
          bad ++;
          break;
        case 0:
          neutral ++;
          break;
        case 1:
          good ++;
          break;
      }
    });
    return {
      good: good,
      neutral: neutral,
      bad: bad,
      total: good + bad + neutral
    };
  }
}