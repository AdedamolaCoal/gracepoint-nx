import { Injectable, signal, computed } from '@angular/core';

export interface ScriptureItem {
  text: string;
  reference: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthLayoutStore {
  readonly logoSrc = signal<string>('general/gpicc.jpg');
  readonly logoAlt = signal<string>('Gracepoint');
  readonly heroImageSrc = signal<string>('auth/hero.webp');
  readonly heroImageAlt = signal<string>('Gracepoint Hero');
  readonly heroBadge = signal<string>('Cheer up folks, The word WORKS!!!');
  readonly copyrightYear = signal<string>('2026');
  readonly copyrightCompany = signal<string>('GRACEPOINT');

  readonly scriptures = signal<ScriptureItem[]>([
    {
      text: 'For the word of God is alive and active. Sharper than any double-edged sword.',
      reference: 'Hebrews 4:12',
    },
    {
      text: 'Your word is a lamp for my feet, a light on my path.',
      reference: 'Psalm 119:105',
    },
    {
      text: 'Heaven and earth will pass away, but my words will never pass away.',
      reference: 'Matthew 24:35',
    },
    {
      text: 'So shall my word be that goes out from my mouth; it shall not return to me empty.',
      reference: 'Isaiah 55:11',
    },
    {
      text: 'The grass withers and the flowers fall, but the word of our God endures forever.',
      reference: 'Isaiah 40:8',
    },
    {
      text: 'In the beginning was the Word, and the Word was with God, and the Word was God.',
      reference: 'John 1:1',
    },
    {
      text: 'So then faith comes by hearing, and hearing by the word of God.',
      reference: 'Romans 10:17',
    },
    {
      text: 'I have hidden your word in my heart that I might not sin against you.',
      reference: 'Psalm 119:11',
    },
    {
      text: 'Every word of God is flawless; he is a shield to those who take refuge in him.',
      reference: 'Proverbs 30:5',
    },
    {
      text: 'Keep this Book of the Law always on your lips; meditate on it day and night.',
      reference: 'Joshua 1:8',
    },
    {
      text: 'Is not my word like fire, declares the LORD, and like a hammer that breaks a rock in pieces?',
      reference: 'Jeremiah 23:29',
    },
    {
      text: 'All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in righteousness.',
      reference: '2 Timothy 3:16',
    },
    {
      text: 'He sent out his word and healed them; he rescued them from the grave.',
      reference: 'Psalm 107:20',
    },
    {
      text: 'If you hold to my teaching, you are really my disciples. Then you will know the truth, and the truth will set you free.',
      reference: 'John 8:31-32',
    },
    {
      text: 'Man shall not live on bread alone, but on every word that comes from the mouth of God.',
      reference: 'Matthew 4:4',
    },
    {
      text: 'For the word of the LORD is right and true; he is faithful in all he does.',
      reference: 'Psalm 33:4',
    },
    {
      text: 'Let the message of Christ dwell among you richly as you teach and admonish one another with all wisdom.',
      reference: 'Colossians 3:16',
    },
    {
      text: 'The unfolding of your words gives light; it gives understanding to the simple.',
      reference: 'Psalm 119:130',
    },
    {
      text: 'But the word of the Lord endures forever. And this is the word that was preached to you.',
      reference: '1 Peter 1:25',
    },
    {
      text: 'My child, pay attention to my words. For they are life to those who find them and health to one’s whole body.',
      reference: 'Proverbs 4:20-22',
    },
    {
      text: 'For I am not ashamed of the gospel, because it is the power of God that brings salvation to everyone who believes.',
      reference: 'Romans 1:16',
    },
    {
      text: 'Take the helmet of salvation and the sword of the Spirit, which is the word of God.',
      reference: 'Ephesians 6:17',
    },
    {
      text: 'All your words are true; all your righteous laws are eternal.',
      reference: 'Psalm 119:160',
    },
    {
      text: 'Do not merely listen to the word, and so deceive yourselves. Do what it says.',
      reference: 'James 1:22',
    },
    {
      text: 'For no matter how many promises God has made, they are "Yes" in Christ.',
      reference: '2 Corinthians 1:20',
    },
    {
      text: 'Your word, LORD, is eternal; it stands firm in the heavens.',
      reference: 'Psalm 119:89',
    },
    {
      text: 'If you remain in me and my words remain in you, ask whatever you wish, and it will be done for you.',
      reference: 'John 15:7',
    },
    {
      text: 'I can do all things through Christ who strengthens me.',
      reference: 'Philippians 4:13',
    },
    {
      text: 'So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you.',
      reference: 'Isaiah 41:10',
    },
    {
      text: 'If God is for us, who can be against us?',
      reference: 'Romans 8:31',
    },
    {
      text: 'Trust in the LORD with all your heart and lean not on your own understanding.',
      reference: 'Proverbs 3:5-6',
    },
    {
      text: 'The LORD is my shepherd, I lack nothing.',
      reference: 'Psalm 23:1',
    },
    {
      text: 'For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you.',
      reference: 'Jeremiah 29:11',
    },
    {
      text: 'For we live by faith, not by sight.',
      reference: '2 Corinthians 5:7',
    },
    {
      text: 'Everything is possible for one who believes.',
      reference: 'Mark 9:23',
    },
    {
      text: 'God is our refuge and strength, an ever-present help in trouble.',
      reference: 'Psalm 46:1',
    },
    {
      text: 'In all these things we are more than conquerors through him who loved us.',
      reference: 'Romans 8:37',
    },
    {
      text: 'No weapon forged against you will prevail, and you will refute every tongue that accuses you.',
      reference: 'Isaiah 54:17',
    },
    {
      text: 'Be strong and courageous. Do not be afraid or terrified, for the LORD your God goes with you.',
      reference: 'Deuteronomy 31:6',
    },
    {
      text: 'This is the day that the LORD has made; let us rejoice and be glad in it.',
      reference: 'Psalm 118:24',
    },
  ]);

  readonly currentScriptureIndex = signal<number>(0);
  readonly isFading = signal<boolean>(false);

  readonly currentScripture = computed(() => {
    const list = this.scriptures();
    const idx = this.currentScriptureIndex();
    return list[idx] || null;
  });

  nextScripture(): void {
    const list = this.scriptures();
    if (list.length <= 1) return;
    this.isFading.set(true);
    setTimeout(() => {
      this.currentScriptureIndex.update((idx) => (idx + 1) % list.length);
      this.isFading.set(false);
    }, 400);
  }

  setScriptures(items: ScriptureItem[]): void {
    this.scriptures.set(items);
    this.currentScriptureIndex.set(0);
  }
}
