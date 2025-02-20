import { TestBed } from '@angular/core/testing';
import { HelperService } from './helper.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import * as urlConfig from '../../services/config/url.config.json';
import * as labelConfig from '../../services/config/label.config.json';
import * as categoryConfig from '../../services/config/category.config.json';
import { async, of } from 'rxjs';
import { PublicDataService } from '../public-data/public-data.service';
import { DataService } from '../data/data.service';

describe('HelperService', () => {
  const configStub = {
    urlConFig: (urlConfig as any).default,
    labelConfig: (labelConfig as any).default,
    categoryConfig: (categoryConfig as any).default,
    editorConfig: { contentPrimaryCategories: [] }
  };

  const serverResponse = {
    id: '',
      params: {
        resmsgid: '',
        msgid: '',
        err: '',
        status: '',
        errmsg: ''
      },
      responseCode: 'OK',
      result: {
      },
      ts: '',
      ver: '',
      headers: {}
  };

  let service: HelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [HttpClient,
        DataService,
        PublicDataService,
        { provide: ConfigService, useValue: configStub }
      ]
    });
    service = TestBed.inject(HelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#channelInfo should return channel info', () => {
    spyOn(service, 'getLicenses').and.returnValue(of(
      {
        license: [{
          identifier: '458552951',
          name: '-458552951',
          status: 'Live'
        }]
      }));
    const channelId = '01309282781705830427';
    spyOn(service, 'getChannelData').and.returnValue(of({
      channel: {
        code: '01309282781705830427',
        contentPrimaryCategories: ['Course Assessment', 'eTextbook']
      }
    }));
    service.initialize(channelId);
    expect(service.channelInfo).toBeTruthy();
  });

  it('setShuffleValue should be called', () => {
    service.setShuffleValue(true);
    service.shuffleValue.subscribe(value =>
      expect(value).toEqual(true));
  });

  it('#contentPrimaryCategories should return primary categories', () => {
    expect(service.contentPrimaryCategories).toBeTruthy();
  });

  it('#getLicenses() should return license on API success', async () => {
    const publicDataService: PublicDataService = TestBed.inject(PublicDataService);
    const response = serverResponse;
    response.result = {
      license: [{
        identifier: '458552951',
        name: '-458552951',
        status: 'Live'
      }]
    };
    spyOn(publicDataService, 'post').and.returnValue(of(response));
    service.getLicenses().subscribe(data => {
      expect(data.license).toBeTruthy();
    });
  });

  it('#getAvailableLicenses should be truthy', () => {
    expect(service.getAvailableLicenses).toBeTruthy();
  });

  it('#getChannelData should be truthy', () => {
    const dataService: DataService = TestBed.inject(DataService);
    const response = serverResponse;
    response.result = {
      channel: {
      }
    };
    spyOn(dataService, 'get').and.returnValue(of(response));
    const channelId = '01309282781705830427';
    service.getChannelData(channelId).subscribe(data => {
      expect(data).toBeTruthy();
    });
  });

  it('#channelData should be truthy', () => {
    expect(service.channelData).toBeTruthy();
  });

  it('#hmsToSeconds() should convert and return seconds', () => {
    const result = service.hmsToSeconds('10:10:10');
    expect(result).toEqual('36610');
  });

  it('#getTimerFormat() should return timer format', ()=> {
    const result = service.getTimerFormat({});
    expect(result).toEqual('HH:mm:ss');
  });

  it('#addDepthToHierarchy should call', () => {
    spyOn(service, 'addDepthToHierarchy').and.callThrough();
    const data = [
      {
        name: 'test',
        objectType: 'QuestionSet',
        primaryCategory: 'Observation With Rubrics',
        index : 0,
        depth : 0,
        children: [
          {
            name: 'test1',
            objectType: 'QuestionSet',
            primaryCategory: 'Observation With Rubrics',
            index : 1,
            depth : 0,
            children : []
          }
        ]
      }
    ];
    // tslint:disable-next-line:prefer-const
    service.addDepthToHierarchy(data);
    expect(service.treeDepth).toEqual(1);
  });

});
