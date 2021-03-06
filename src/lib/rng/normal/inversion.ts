'use strict'
/* This is a conversion from libRmath.so to Typescript/Javascript
Copyright (C) 2018  Jacob K.F. Bogers  info@mail.jacob-bogers.com

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
import { IRNG } from '../';
import { qnorm } from '../../normal/qnorm';
import { MersenneTwister } from '../mersenne-twister';
import { IRNGNormal } from './inormal-rng';

const BIG = 134217728; /* 2^27 */

const { isArray } = Array;
export class Inversion extends IRNGNormal {
  constructor(_rng: IRNG  = new MersenneTwister(0) ) {
    super(_rng);
  }

  protected internal_norm_rand(): number {
    /* unif_rand() alone is not of high enough precision */
    let u1 = this.rng.unif_rand() as number;
    let t =  this.rng.unif_rand() as number;
    u1 = new Int32Array([BIG * u1])[0] + t;
    const result = qnorm(u1 / BIG, 0.0, 1.0, !!1, !!0);
    return isArray(result) ? result[0] : result;
  }
}
